import { pgTable, text, serial, integer, timestamp, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  displayName: text("display_name"),
  profileImage: text("profile_image"),
  spotifyId: text("spotify_id").unique(),
  spotifyToken: text("spotify_token"),
  spotifyRefreshToken: text("spotify_refresh_token"),
  spotifyTokenExpiry: timestamp("spotify_token_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Playlist model
export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  spotifyId: text("spotify_id"),
  isPublic: integer("is_public").default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// Track model to store track information
export const tracks = pgTable("tracks", {
  id: text("id").primaryKey(), // Spotify track ID
  name: text("name").notNull(),
  artistsJson: jsonb("artists").notNull(), // Store artists as JSON
  albumName: text("album_name").notNull(),
  albumImage: text("album_image"),
  durationMs: integer("duration_ms").notNull(),
  spotifyUri: text("spotify_uri").notNull(),
  previewUrl: text("preview_url"),
  popularity: integer("popularity"),
  addedAt: timestamp("added_at").notNull().defaultNow()
});

// Join table for playlists and tracks
export const playlistTracks = pgTable("playlist_tracks", {
  playlistId: integer("playlist_id").notNull().references(() => playlists.id),
  trackId: text("track_id").notNull().references(() => tracks.id),
  addedAt: timestamp("added_at").notNull().defaultNow(),
  addedBy: integer("added_by").references(() => users.id),
  position: integer("position").notNull()
}, (t) => ({
  pk: primaryKey({ columns: [t.playlistId, t.trackId] })
}));

// Liked tracks (user's favorites)
export const likedTracks = pgTable("liked_tracks", {
  userId: integer("user_id").notNull().references(() => users.id),
  trackId: text("track_id").notNull().references(() => tracks.id),
  addedAt: timestamp("added_at").notNull().defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.trackId] })
}));

// Recently played tracks
export const recentlyPlayed = pgTable("recently_played", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  trackId: text("track_id").notNull().references(() => tracks.id),
  playedAt: timestamp("played_at").notNull().defaultNow(),
  context: jsonb("context") // Optional JSON with context info (playlist, album, etc.)
});

// Authentication schema
export const spotifyAuthSchema = z.object({
  code: z.string(),
  redirectUri: z.string(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  profileImage: true,
  spotifyId: true,
  spotifyToken: true,
  spotifyRefreshToken: true
});

export const insertTrackSchema = createInsertSchema(tracks).pick({
  id: true,
  name: true,
  artistsJson: true,
  albumName: true,
  albumImage: true,
  durationMs: true,
  spotifyUri: true,
  previewUrl: true,
  popularity: true
});

export const insertPlaylistSchema = createInsertSchema(playlists).pick({
  userId: true,
  name: true,
  description: true,
  coverImage: true,
  spotifyId: true,
  isPublic: true
});

export const insertPlaylistTrackSchema = createInsertSchema(playlistTracks).pick({
  playlistId: true,
  trackId: true,
  addedBy: true,
  position: true
});

export const insertLikedTrackSchema = createInsertSchema(likedTracks).pick({
  userId: true,
  trackId: true
});

export const insertRecentlyPlayedSchema = createInsertSchema(recentlyPlayed).pick({
  userId: true,
  trackId: true,
  context: true
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SpotifyAuth = z.infer<typeof spotifyAuthSchema>;

export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Track = typeof tracks.$inferSelect;

export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;

export type InsertPlaylistTrack = z.infer<typeof insertPlaylistTrackSchema>;
export type PlaylistTrack = typeof playlistTracks.$inferSelect;

export type InsertLikedTrack = z.infer<typeof insertLikedTrackSchema>;
export type LikedTrack = typeof likedTracks.$inferSelect;

export type InsertRecentlyPlayed = z.infer<typeof insertRecentlyPlayedSchema>;
export type RecentlyPlayed = typeof recentlyPlayed.$inferSelect;
