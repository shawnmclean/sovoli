import type { InferUITools, ToolSet, UIDataTypes, UIMessage } from "ai";
import { tool } from "ai";
import { z } from "zod";

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

  setupFamily: tool({
    description: `
  Initiates or manages the family setup process.
  This tool can start an interactive flow for collecting information
  about the user's family members (children, parents, guardians, etc.).
  It replaces the separate getAge/getMoreChildren/getLocation steps.`,
    inputSchema: z.object({
      action: z
        .enum(["start", "add", "remove", "update", "list"])
        .default("start")
        .describe("What part of the family setup to run."),
      memberType: z
        .enum(["child", "parent", "guardian"])
        .default("child")
        .describe("Type of family member being configured."),
      member: z
        .object({
          id: z.string().optional(),
          name: z.string().optional(),
          years: z.number().optional(),
          months: z.number().optional(),
          notes: z.string().optional(),
        })
        .optional(),
    }),
    outputSchema: z.object({
      success: z.boolean().default(true),
      message: z.string().optional(),
      members: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            relationship: z.string(),
            age: z.number(),
            notes: z.string().optional(),
          }),
        )
        .optional(),
    }),
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
