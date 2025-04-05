import { z } from "zod";

const baseKnowledgeFields = {
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  assets: z.array(z.object({ id: z.string() })).optional(),
};

export const formCreateDraftKnowledgeSchema = z.object({
  ...baseKnowledgeFields,
});
export type FormCreateDraftKnowledgeSchema = z.infer<
  typeof formCreateDraftKnowledgeSchema
>;

export const formSaveDraftKnowledgeSchema = z.object({
  id: z.string(), // required
  ...baseKnowledgeFields,
});
export type FormSaveDraftKnowledgeSchema = z.infer<
  typeof formSaveDraftKnowledgeSchema
>;
