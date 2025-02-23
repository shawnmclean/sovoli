## Media Asset Management System

This ADR is a living document for implementing the media asset system (images, videos, sounds).

## Status: Draft

Date: 2025-02-02

## Context

We initially started with uploading and generating images from ChatGPT. This was then passed to our API where a background job would take it and add it to supabase storage.

The basic behavior included linking the knowledge in the asset as a foreign key.

We outgrew this very quickly as we needed to support uploading of images before a knowledge was even created, so we can run AI workloads on them such as OCR and highlight extraction.

### Media Types

- Images - These can be photos of book pages that are annotations. Or just an hero image representing the post.

- Videos - Videos may explain certain things better, so supporting this as a media is important.

- Sounds - This can be podcast type or just recorded voice notes that people will reply to such as how they do on whatsapp.

### Placement

- cover - This will be shown at the top and used as an OG image too.

- inline - This will be referenced within the content of the knowledge itself.

### Behaviors

- Many to Many - knowledge can be linked to many media assets, and another knowledge can reference asset from another knowledge. Hence Many to Many.

- User Profile Photos - Users can upload their profile photos using this system.

- Annotations - Temporal AI workloads - in some cases we need to analyze an image and extract information from them before they are assigned to a knowledge. This means we need a cleanup mechanism later.

- AI generated - May need to get images from external systems. Such as existing link, like in the ChatGPT use case.

## System Design

### Data Flow

1. Annotations

2. Regular Image Upload

3. Multiple Carousel Image Support

4. Clean Up

#### Uploads

Method: **Compressed Signed Browser Upload**



We will run browser level compression so we can not only decrease the storage space requirement but also to improve the upload time, as in the case of *Annotations*, we need to send the image to the AI model very quickly.

We'll seed the react hook with a lit of upload signatures that will be used to upload images to cloudinary.

```mermaid
sequenceDiagram
  SSR ->> Browser: Get list of upload signatures
  Browser ->> Browser: Compress image & display preview
  Browser ->> Browser: Check if signatures are available and valid
  alt Signatures expired or empty
    Browser ->> API: Request new upload signatures
    API ->> Browser: Return new upload signatures
  end
  Browser ->> Cloudinary: Upload image using signature
  Cloudinary ->> Browser: Return uploaded image data

```

How to handle a set of loaded up signatures for use? Getting new ones when necessary.


#### Delete

#### Reorder

#### Display

#### Clean Up

### Data Schema






Notes for blog:

- the signature for supabase makes a call to their server, for what?
- 