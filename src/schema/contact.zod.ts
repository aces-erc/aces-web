import { z } from "zod";

export const NewContactSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  subject: z.string(),
  message: z.string(),
});
export type NewContact = z.infer<typeof NewContactSchema>;
