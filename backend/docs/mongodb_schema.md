# MongoDB Collection Schema Guide

We are using MongoDB as our primary database. Below are the document blueprints for each collection under the `tubefetch` database.

---

## 1. `profiles` Collection
Stores metadata of authenticated users synced lazily upon their first login.

```json
{
  "_id": "uuid-from-supabase-auth",      // Matches auth.users.id from Supabase
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://lh3.googleusercontent.com/...",
  "created_at": "ISODate('2026-06-26T21:40:00Z')"
}
```

---

## 2. `downloads` Collection
Stores a history of media downloaded by users.

```json
{
  "_id": "ObjectId('65d6c8b9f0...')",
  "user_id": "uuid-from-supabase-auth",  // Reference to profiles._id
  "video_title": "Rick Astley - Never Gonna Give You Up",
  "video_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
  "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "format": "mp3",
  "quality": "320kbps",
  "file_size": 8523885,
  "download_status": "completed",        // 'downloading', 'completed', 'failed', 'paused'
  "created_at": "ISODate('2026-06-26T21:44:14Z')"
}
```

---

## 3. `user_preferences` Collection
Stores user configuration and dashboard preferences.

```json
{
  "_id": "uuid-from-supabase-auth",      // One-to-one mapping with profiles._id
  "theme": "dark",                       // 'light' or 'dark'
  "default_quality": "1080p",            // '4K', '1080p', '720p', etc.
  "default_format": "mp4",               // 'mp4', 'mp3', 'flac', etc.
  "language": "en",
  "updated_at": "ISODate('2026-06-26T21:50:00Z')"
}
```

---

## Access Indexes Recommendation
To ensure high-performance queries, build the following indexes in MongoDB:
- `downloads`: `{ user_id: 1, created_at: -1 }` (for fast history queries sorting by newest first).
- `profiles`: `{ email: 1 }` (unique index, for email-based lookups).
