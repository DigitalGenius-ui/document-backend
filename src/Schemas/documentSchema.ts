import { z } from "zod";

export const documentSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  mentions: z.string().array().optional(),
  documentId: z.string(),
  visibility: z.enum(["Public", "Private", "Draft"]).optional(),
});
