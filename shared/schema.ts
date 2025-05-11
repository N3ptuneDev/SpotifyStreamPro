import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  spotifyToken: text("spotify_token"),
  spotifyRefreshToken: text("spotify_refresh_token"),
  spotifyTokenExpiry: timestamp("spotify_token_expiry"),
});

export const recentlyPlayed = pgTable("recently_played", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  trackId: text("track_id").notNull(),
  trackData: jsonb("track_data").notNull(),
  playedAt: timestamp("played_at").notNull().defaultNow(),
});

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const spotifyAuthSchema = z.object({
  code: z.string(),
  redirectUri: z.string(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRecentlyPlayedSchema = createInsertSchema(recentlyPlayed).pick({
  userId: true,
  trackId: true,
  trackData: true,
});

export const insertPlaylistSchema = createInsertSchema(playlists).pick({
  userId: true,
  name: true,
  description: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SpotifyAuth = z.infer<typeof spotifyAuthSchema>;
export type InsertRecentlyPlayed = z.infer<typeof insertRecentlyPlayedSchema>;
export type RecentlyPlayed = typeof recentlyPlayed.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;
