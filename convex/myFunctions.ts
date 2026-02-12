import { v } from "convex/values";
import {
  query,
  action,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { formatBibleVerseESV, parseBibleVerseCUVS } from "../lib/utils";
import { Doc, Id } from "./_generated/dataModel";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

export const addUser = internalMutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("byuserId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    const newUserId = await ctx.db.insert("users", {
      userId: args.userId,
      createdAt: Date.now(),
    });

    return newUserId;
  },
});

export const addPrayerClick = action({
  args: {
    prayerId: v.id("prayers"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    let user = await ctx.runQuery(internal.myFunctions.getUserByUserId, {
      userId: args.userId,
    });
    if (user === null) {
      await ctx.runMutation(internal.myFunctions.addUser, {
        userId: args.userId,
      });
      user = await ctx.runQuery(internal.myFunctions.getUserByUserId, {
        userId: args.userId,
      });
      if (user === null) {
        throw new Error("Failed to create or retrieve user.");
      }
    }

    await ctx.runMutation(internal.myFunctions.clickedPrayer, {
      prayerId: args.prayerId,
      userId: user._id,
    });
  },
});

export const clickedPrayer = internalMutation({
  args: {
    prayerId: v.id("prayers"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("prayer_clicks", {
      prayerId: args.prayerId,
      userId: args.userId,
    });

    const prayer = await ctx.db.get(args.prayerId);
    if (prayer) {
      await ctx.db.patch(args.prayerId, {
        prayedCount: prayer.prayedCount + 1,
      });
    }
  },
});

export type PrayerWithStatus = Doc<"prayers"> & { prayed: boolean };

export const getAllPrayers = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args): Promise<PrayerWithStatus[]> => {
    let user: Doc<"users"> | null = null;

    if (args.userId !== "") {
      user = await ctx.db
        .query("users")
        .withIndex("byuserId", (q) => q.eq("userId", args.userId))
        .first();
    }

    return await ctx.runQuery(
      internal.myFunctions.getAllPrayersAndPrayerClicked,
      {
        userId: user?._id ?? undefined,
      },
    );
  },
});

export const getAllPrayersAndPrayerClicked = internalQuery({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const prayers = await ctx.db
      .query("prayers")
      .withIndex("by_createdAtAndIsPublic", (q) => q.eq("isPublic", true))
      .order("desc")
      .collect();

    if (args.userId !== undefined) {
      const userPrays = await ctx.db
        .query("prayer_clicks")
        .withIndex("by_prayer_user", (q) => q.eq("userId", args.userId!))
        .collect();

      const prayedSet = new Set(userPrays.map((p) => p.prayerId));

      // Add `prayed` field to each prayer
      return prayers.map((prayer) => ({
        ...prayer,
        prayed: prayedSet.has(prayer._id),
      }));
    } else {
      return prayers.map((prayer) => ({
        ...prayer,
        prayed: false,
      }));
    }
  },
});

export const checkAndAddPrayer = action({
  args: {
    content: v.string(),
    title: v.string(),
    bibleVerses: v.string(),
    expiresAt: v.optional(v.number()),
    username: v.string(),
    userId: v.string(),
    isPublic: v.boolean(),
    color: v.union(
      v.literal("white"),
      v.literal("yellow"),
      v.literal("cyan"),
      v.literal("red"),
    ),
  },

  handler: async (ctx, args): Promise<string> => {
    const isProfanity = await checkProfanity(
      args.title.concat(" ", args.content),
    );
    if (isProfanity) {
      throw new Error("Profanity detected in prayer request.");
    }
    let user: {
      _id: Id<"users">;
      _creationTime: number;
      userId: string;
      createdAt: number;
    } | null = null;

    user = await ctx.runQuery(internal.myFunctions.getUserByUserId, {
      userId: args.userId,
    });

    if (!user) {
      await ctx.runMutation(internal.myFunctions.addUser, {
        userId: args.userId,
      });
      user = await ctx.runQuery(internal.myFunctions.getUserByUserId, {
        userId: args.userId,
      });
    }

    if (!user) {
      throw new Error("Failed to create or retrieve user.");
    }

    let versesTextCUVS = "";
    let versesTextESV = "";
    if (args.bibleVerses !== undefined && args.bibleVerses !== "") {
      const parsedVerse = parseBibleVerseCUVS(args.bibleVerses || "");
      if (!parsedVerse) {
        throw new Error("Invalid bible verse format.");
      }
      const { book, chapter, verses } = parsedVerse;
      const resCUVS = await fetch(
        `https://bible.helloao.org/api/cmn_cu1/${book}/${chapter}.json`,
      );

      const resESV = await fetch(
        `https://api.esv.org/v3/passage/text/?q=${book}+${chapter}:${verses.join("-")}&include-passage-references=false&include-first-verse-numbers=false&include-footnotes=false&include-footnote-body=false&include-headings=false&include-short-copyright=false`,
        {
          headers: {
            Authorization: `Token ${process.env.ESV_API_KEY}`,
          },
        },
      );
      const dataESV = await resESV.json();
      console.log(formatBibleVerseESV(dataESV.passages[0]));
      versesTextESV = formatBibleVerseESV(dataESV.passages[0]);
      // .map((passage: string, index: number) =>
      //   dataESV.passages.length > 2
      //     ? index + " " + passage.trim()
      //     : passage.trim(),
      // )
      // .join("<br>");

      const dataCUVS = await resCUVS.json();

      if (verses.length === 1) {
        const verseObj = dataCUVS.chapter.content.find(
          (v: { number: number }) => v.number === verses[0],
        );
        if (verseObj && verseObj.content && verseObj.content.length > 0) {
          if (typeof verseObj.content[0] === "string") {
            versesTextCUVS = verseObj.content[0];
          } else {
            let bibleLine = "";
            verseObj.content.map(
              (line: { lineBreak?: boolean; poem?: string; text?: string }) => {
                if (line.lineBreak) bibleLine += "\n";
                if (line.poem) bibleLine += line.text;
              },
            );
            versesTextCUVS = bibleLine;
          }
        }
      } else if (verses.length > 1) {
        versesTextCUVS = verses
          .map((verseNumber) => {
            const verseObj = dataCUVS.chapter.content.find(
              (v: { number: number }) => v.number === verseNumber,
            );

            if (verseObj && verseObj.content && verseObj.content.length > 0) {
              if (typeof verseObj.content[0] === "string") {
                return `${verseNumber} ${verseObj.content[0]}`;
              } else {
                return (
                  `${verseNumber} ` +
                  verseObj.content
                    .map(
                      (
                        line: {
                          lineBreak?: boolean;
                          poem?: string;
                          text?: string;
                        },
                        lineIndex: number,
                      ) => {
                        if (line.lineBreak && lineIndex !== 0) return "\n";
                        if (line.poem) return line.text;
                        return null;
                      },
                    )
                    .filter((text: string | null) => text !== null)
                    .join(" ")
                );
              }
            }
            return null;
          })
          .filter((text: string | null) => text !== null)
          .join("\n");
      }
    }

    const prayerId = await ctx.runMutation(internal.myFunctions.addPrayer, {
      content: args.content,
      title: args.title,
      bibleVerseCUVS: versesTextCUVS,
      bibleVerseESV: versesTextESV,
      bibleVerseRef: args.bibleVerses || "",
      username: args.username,
      expiresAt: args.expiresAt,
      createdBy: user._id,
      color: args.color,
      isPublic: args.isPublic,
    });
    return prayerId;
  },
});

export const getUserByUserId = internalQuery({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("byuserId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const addPrayer = internalMutation({
  args: {
    content: v.string(),
    title: v.string(),
    bibleVerseCUVS: v.optional(v.string()),
    bibleVerseESV: v.optional(v.string()),
    bibleVerseRef: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    username: v.optional(v.string()),
    createdBy: v.id("users"),
    color: v.union(
      v.literal("white"),
      v.literal("yellow"),
      v.literal("cyan"),
      v.literal("red"),
    ),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const prayerId = await ctx.db.insert("prayers", {
      content: args.content,
      title: args.title,
      bibleVerseESV: args.bibleVerseESV || "",
      bibleVerseCUVS: args.bibleVerseCUVS || "",
      bibleVerseRef: args.bibleVerseRef || "",
      prayedCount: 0,
      color: args.color,
      createdBy: args.createdBy,
      createdAt: Date.now(),
      expiresAt: args.expiresAt,
      username: args.username,
      isPublic: args.isPublic,
    });
    return prayerId;
  },
});

async function checkProfanity(text: string): Promise<boolean> {
  const res = await fetch("https://vector.profanity.dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: text }),
  });

  const data = await res.json();
  if (data.isProfanity) {
    return true;
  }
  return false;
}
