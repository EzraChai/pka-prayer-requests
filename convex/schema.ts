import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  users: defineTable({
    userId: v.string(),
    createdAt: v.number(),
  }).index("byuserId", ["userId"]),

  prayers: defineTable({
    content: v.string(),
    title: v.string(),
    bibleVerseESV: v.optional(v.string()),
    bibleVerseCUVS: v.optional(v.string()),
    bibleVerseESVRef: v.optional(v.string()),
    bibleVerseCUVSRef: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    username: v.optional(v.string()),
    prayedCount: v.number(),
    isPublic: v.boolean(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_createdAtAndIsPublic", ["isPublic", "createdAt"])
    .index("by_createdBy", ["createdBy"])
    .index("by_expiresAt", ["expiresAt"]),

  prayer_clicks: defineTable({
    prayerId: v.id("prayers"),
    userId: v.id("users"),
    clickedAt: v.number(),
  }).index("by_prayer_user", ["prayerId", "userId"]),

  linkTokens: defineTable({
    token: v.string(),
    userId: v.id("users"),
    expiresAt: v.number(),
    used: v.boolean(),
    createdAt: v.number(),
  }).index("by_token", ["token"]),
});
