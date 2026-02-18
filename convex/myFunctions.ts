import { ConvexError, v } from "convex/values";
import {
  query,
  action,
  internalQuery,
  internalMutation,
  mutation,
} from "./_generated/server";
import { api, internal } from "./_generated/api";
import {
  formatBibleVerseESV,
  generateUrlSafeToken,
  parseBibleVerseCUVS,
} from "../lib/utils";
import { Doc, Id } from "./_generated/dataModel";
import { BIBLE_BOOKS } from "../lib/bible-data";
import { paginationOptsValidator, PaginationResult } from "convex/server";

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
    console.log(user);
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

    await ctx.runMutation(internal.myFunctions.clickPrayer, {
      prayerId: args.prayerId,
      userId: user._id,
    });
  },
});

export const generateToken = action({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    // Generate a unique token for the user
    let user = await ctx.runQuery(internal.myFunctions.getUserByUserId, {
      userId: args.userId,
    });
    if (user) {
      const link_tokens = await ctx.runQuery(
        internal.myFunctions.getTokensByUserId,
        {
          userId: user._id,
        },
      );

      if (link_tokens.length > 0) {
        return link_tokens[0].token;
      }
    } else {
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

    const token = await generateUrlSafeToken(user._id);
    await ctx.runMutation(internal.myFunctions.insertTokens, {
      userId: user._id,
      token: token,
    });
    return token;
  },
});

export const verifyToken = action({
  args: {
    userId: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const token = await ctx.runQuery(internal.myFunctions.getTokensByToken, {
      token: args.token,
    });
    if (!token) {
      throw new ConvexError({
        message: "Invalid token",
        code: "INVALID_TOKEN",
      });
    }

    const user = await ctx.runQuery(internal.myFunctions.getUserById, {
      id: token.userId,
    });
    if (!user) {
      throw new ConvexError({
        message: "User not found for token",
        code: "USER_NOT_FOUND",
      });
    }

    if (user.userId === args.userId) {
      throw new ConvexError({
        message: "Cannot link with the same user",
        code: "SAME_USER_LINK",
      });
    }

    await ctx.runMutation(internal.myFunctions.setTokenUsed, {
      id: token._id,
    });

    return user.userId;
  },
});

export const setTokenUsed = internalMutation({
  args: {
    id: v.id("link_tokens"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      used: true,
    });
  },
});

export const getUserById = internalQuery({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
});

export const getTokensByToken = internalQuery({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("link_tokens")
      .withIndex("by_token", (q) =>
        q.eq("token", args.token).eq("used", false).gt("expiresAt", Date.now()),
      )
      .first();
  },
});

export const getTokensByUserId = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("link_tokens")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.userId).gt("expiresAt", Date.now()),
      )
      .collect();
  },
});

export const insertTokens = internalMutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("link_tokens", {
      userId: args.userId,
      token: args.token,
      expiresAt: Date.now() + 10 * 60 * 1000, // Token valid for 10 minutes
      used: false,
      createdAt: Date.now(),
    });
  },
});

export const clickPrayer = internalMutation({
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
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args): Promise<PaginationResult<PrayerWithStatus>> => {
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
        paginationOpts: args.paginationOpts,
      },
    );
  },
});

export const getAllPrayersById = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"prayers">[]> => {
    if (args.userId === "") {
      return [];
    }
    const user = await ctx.runQuery(internal.myFunctions.getUserByUserId, {
      userId: args.userId,
    });
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("prayers")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", user._id))
      .order("desc")
      .collect();
  },
});

export const deletePrayerById = mutation({
  args: {
    prayerId: v.id("prayers"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.prayerId);
  },
});

export const getAllPrayersAndPrayerClicked = internalQuery({
  args: {
    userId: v.optional(v.id("users")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const prayers = await ctx.db
      .query("prayers")
      .withIndex("by_createdAtAndIsPublic", (q) => q.eq("isPublic", true))
      .order("desc")
      .paginate(args.paginationOpts);

    if (args.userId !== undefined) {
      const userPrays = await ctx.db
        .query("prayer_clicks")
        .withIndex("by_prayer_user", (q) => q.eq("userId", args.userId!))
        .collect();

      const prayedSet = new Set(userPrays.map((p) => p.prayerId));

      return {
        ...prayers,
        page: prayers.page.map((prayer) => ({
          ...prayer,
          prayed: prayedSet.has(prayer._id),
        })),
      };
    } else {
      return {
        ...prayers,
        page: prayers.page.map((prayer) => ({
          ...prayer,
          prayed: false,
        })),
      };
    }
  },
});

export const checkAndAddPrayer = action({
  args: {
    id: v.optional(v.id("prayers")),
    prayedCount: v.optional(v.number()),
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
      v.literal("green"),
    ),
  },

  handler: async (ctx, args): Promise<void> => {
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
        `https://api.esv.org/v3/passage/text/?q=${
          BIBLE_BOOKS.find((b) => b.abbr === book)?.engName
        }+${chapter}:${verses.join("-")}&include-passage-references=false&include-first-verse-numbers=false&include-footnotes=false&include-footnote-body=false&include-headings=false&include-short-copyright=false`,
        {
          headers: {
            Authorization: `Token ${process.env.ESV_API_KEY}`,
          },
        },
      );
      const dataESV = await resESV.json();
      versesTextESV = formatBibleVerseESV(dataESV.passages[0]);

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

    await ctx.runMutation(internal.myFunctions.addPrayer, {
      id: args.id,
      prayedCount: args.prayedCount,
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
    id: v.optional(v.id("prayers")),
    prayedCount: v.optional(v.number()),
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
      v.literal("green"),
    ),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (args.id) {
      await ctx.db.patch(args.id, {
        content: args.content,
        title: args.title,
        bibleVerseESV: args.bibleVerseESV || "",
        bibleVerseCUVS: args.bibleVerseCUVS || "",
        bibleVerseRef: args.bibleVerseRef || "",
        prayedCount: args.prayedCount || 0,
        color: args.color,
        createdBy: args.createdBy,
        createdAt: Date.now(),
        expiresAt: args.expiresAt,
        username: args.username,
        isPublic: args.isPublic,
      });
    } else {
      await ctx.db.insert("prayers", {
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
    }
    ctx.scheduler.runAfter(0, api.myFunctions.sendToTelegram, {
      message: `🙏 *New Prayer Request*

📝 *${escapeTelegramMarkdown(args.title)}*

💬 *Prayer:*
${escapeTelegramMarkdown(args.content)}
${
  args.bibleVerseRef &&
  args.bibleVerseESV &&
  args.bibleVerseCUVS &&
  `
📖 _${BIBLE_BOOKS.find((book) => book.abbr === args.bibleVerseRef?.split(" ")[0])?.engName} ${args.bibleVerseRef?.split(" ")[1]}_

_${escapeTelegramMarkdown(args.bibleVerseESV)}_
_${escapeTelegramMarkdown(args.bibleVerseCUVS)}_
    `
}

👤 Submitted by ${args.username ? escapeTelegramMarkdown(args.username) : "Anonymous"}`,
    });
  },
});

function escapeTelegramMarkdown(text: string): string {
  // Escape all special characters for Telegram Markdown V2
  const specialChars = "_*[]()~`>#+-=|{}.!";
  return text?.replace(
    new RegExp(
      `([${specialChars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}])`,
      "g",
    ),
    "\\$1",
  );
}

export const sendToTelegram = action({
  args: {
    message: v.string(),
  },
  handler: async (_, args) => {
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: "-1003777112746",
          text: args.message,
          parse_mode: "MarkdownV2",
        }),
      },
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }
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
