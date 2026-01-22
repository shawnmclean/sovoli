import { z } from "zod";

export interface ProgramCategoryDefinition {
  id: string;
  name: string;
  parentId?: string;
  children?: ProgramCategoryDefinition[];
}

// Zod schema for ProgramCategoryDefinition (recursive)
export const programCategoryDefinitionSchema: z.ZodType<ProgramCategoryDefinition> =
  z.lazy(() =>
    z.object({
      id: z.string(),
      name: z.string(),
      parentId: z.string().optional(),
      children: z.array(programCategoryDefinitionSchema).optional(),
    }),
  );

export interface ProgramCategory {
  id: string;
  name: string;
  parent?: ProgramCategory; // recursive chain
}
