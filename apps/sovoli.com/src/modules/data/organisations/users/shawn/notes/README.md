# User Knowledge System

This directory contains the MDX-based knowledge system for users. Each user has their own `notes/` directory containing their knowledge items.

## Structure

```
users/
├── shawn/
│   └── notes/
│       ├── my-study-notes.mdx
│       ├── react-fundamentals.mdx
│       ├── typescript-guide.mdx
│       ├── types.ts
│       ├── services/
│       │   ├── GetUserKnowledgeByUsername.ts
│       │   ├── GetAllUsersAndSlugs.ts
│       │   └── GetKnowledgeBySlug.ts
│       └── index.ts
└── other-user/
    └── notes/
        └── their-knowledge.mdx
```

## Usage

### 1. Create a Knowledge Item

Create a new `.mdx` file in the user's `notes/` directory:

```mdx
---
id: "user-slug"
title: "My Knowledge Item"
description: "Description of the knowledge item"
type: "note" # or "book", "collection", "shelf"
slug: "my-knowledge-item"
isOrigin: true
isPublic: true
isDraft: false
createdAt: "2024-01-01T00:00:00Z"
updatedAt: "2024-01-01T00:00:00Z"
userId: "username"
mediaAssets: []
---

# My Knowledge Item

Your content here...
```

### 2. Access Knowledge Items

The system provides three main services:

- `GetUserKnowledgeByUsernameQueryHandler` - Get all knowledge for a user
- `GetAllUsersAndSlugsQueryHandler` - Get all users and their slugs
- `GetKnowledgeBySlugQueryHandler` - Get a specific knowledge item

### 3. View in Browser

- User page: `/users/[username]` - Shows all knowledge items for a user
- Knowledge item: `/users/[username]/[slug]` - Shows a specific knowledge item

## Features

- **MDX Support**: Rich content with frontmatter metadata
- **Markdown Rendering**: Uses react-markdown with remark-gfm for rich content
- **Photo Integration**: Uses the core Photo interface for consistent image handling
- **Type Safety**: Full TypeScript support
- **File System**: No database required, everything in files
- **Responsive Design**: Mobile-friendly UI components

## Photos

Photos are stored in the frontmatter using the Photo interface structure:

```yaml
coverPhoto:
  url: "/orgs/users/shawn/notes/photos/cover.webp"
  alt: "Cover Image"
  caption: "Description of the cover image"
  category: "default"
  publicId: "shawn-cover-image"

inlinePhotos:
  - url: "/orgs/users/shawn/notes/photos/diagram.webp"
    alt: "Diagram"
    caption: "Description of the diagram"
    category: "default"
    publicId: "shawn-diagram"
```

## Types

- `KnowledgeFile` - Main knowledge item interface
- `Photo` - Photo interface (from core photos module)
- `UserKnowledge` - User with their knowledge items
- `UserSlug` - Username and slug pair
