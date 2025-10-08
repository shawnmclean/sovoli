import type { InferUITools, ToolSet, UIDataTypes, UIMessage } from "ai";
import { tool } from "ai";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const tools = {
  getAge: tool({
    description: "Get the age of the user",
    inputSchema: z.object({}),
    outputSchema: z.object({ years: z.number(), months: z.number() }),
  }),
  getMoreChildren: tool({
    description: "Ask if the user wants to add another child",
    outputSchema: z.object({ choice: z.enum(["add", "done"]) }),
    inputSchema: z.object({}),
  }),
  getLocation: tool({
    description: "Get the location of the user",
    inputSchema: z.object({}),
  }),
} satisfies ToolSet;

export const chatInputTypes = ["age", "location"] as const;

export type ChatInputType = (typeof chatInputTypes)[number];

export const messageMetadataSchema = z.object({
  createdAt: z.number().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type ChatTools = InferUITools<typeof tools>;

export type ChatMessage = UIMessage<MessageMetadata, UIDataTypes, ChatTools>;
