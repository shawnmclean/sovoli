import { z } from "zod";

export const createSignedUrlRequestBodySchema = z.object({
  fileName: z.string(),
  type: z.string(),
});

export const createSignedUrlResponseBodySchema = z.object({
  signedUrl: z.string(),
  token: z.string(),
  path: z.string(),
});
