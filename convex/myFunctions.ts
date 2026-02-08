import { v } from "convex/values";
import {
  query,
  mutation,
  action,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { parseBibleVerseCUVS } from "../lib/utils";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

export const addUser = mutation({
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

export const getAllPrayers = query({
  args: {},
  handler: async (ctx) => {
    const prayers = await ctx.db
      .query("prayers")
      .withIndex("by_createdAtAndIsPublic", (q) => q.eq("isPublic", true))
      .order("desc")
      .collect();

    // Filter prayers by isPublic after collecting
    const publicPrayers = prayers.filter((prayer) => prayer.isPublic);

    return publicPrayers;
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
  },

  handler: async (ctx, args): Promise<string> => {
    const isProfanity = await checkProfanity(
      args.title.concat(" ", args.content),
    );
    if (isProfanity) {
      throw new Error("Profanity detected in prayer request.");
    }

    const user = await ctx.runQuery(internal.myFunctions.getUserByUserId, {
      userId: args.userId,
    });
    if (!user) {
      throw new Error("User not found.");
    }

    let versesTextCUVS = "";
    if (args.bibleVerses !== undefined && args.bibleVerses !== "") {
      const parsedVerse = parseBibleVerseCUVS(args.bibleVerses || "");
      if (!parsedVerse) {
        throw new Error("Invalid bible verse format.");
      }
      const { book, chapter, verses } = parsedVerse;
      const res = await fetch(
        `https://bible.helloao.org/api/cmn_cu1/${book}/${chapter}.json`,
      );

      const data = await res.json();
      versesTextCUVS = verses
        .map((verseNumber) => {
          const verseObj = data.chapter.content.find(
            (v: { number: number }) => v.number === verseNumber,
          );
          return verseObj ? `${verseNumber} ${verseObj.content[0]}` : null;
        })
        .filter((text: string | null) => text !== null)
        .join(" ");

      console.log(versesTextCUVS);
    }

    const prayerId = await ctx.runMutation(internal.myFunctions.addPrayer, {
      content: args.content,
      title: args.title,
      bibleVerseCUVS: versesTextCUVS,
      bibleVerseESV: "",
      bibleVerseCUVSRef: args.bibleVerses || "",
      // bibleVerseESVRef: args.bibleVerseESVRef || "",
      username: args.username,
      expiresAt: args.expiresAt,
      createdBy: user._id,
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
    bibleVerseCUVSRef: v.optional(v.string()),
    bibleVerseESVRef: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    username: v.optional(v.string()),
    createdBy: v.id("users"),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const prayerId = await ctx.db.insert("prayers", {
      content: args.content,
      title: args.title,
      bibleVerseESV: args.bibleVerseESV || "",
      bibleVerseCUVS: args.bibleVerseCUVS || "",
      bibleVerseCUVSRef: args.bibleVerseCUVSRef || "",
      bibleVerseESVRef: args.bibleVerseESVRef || "",
      prayedCount: 0,
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
