import type { UIMessage } from "ai";
import { z } from "zod";

export const chatInputTypes = ["age", "location"] as const;

export type ChatInputType = (typeof chatInputTypes)[number];

export const baseMetadataSchema = z.object({
  createdAt: z.number().optional(),
  isQuestion: z.boolean().default(false),
});

export const questionMetadataSchema = z.object({
  isQuestion: z.literal(true),
  inputType: z.enum(chatInputTypes),
  answered: z.boolean().default(false),
});

export const messageMetadataSchema = z.discriminatedUnion("isQuestion", [
  baseMetadataSchema.extend({ isQuestion: z.literal(false) }),
  baseMetadataSchema.merge(questionMetadataSchema),
]);

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

// Create a typed UIMessage
export type ExtendedUIMessage = UIMessage<MessageMetadata>;
