import { z } from "zod";

const CommitteeSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters long",
  }),
  position: z.string().min(5, {
    message: "Position must be at least 5 characters long",
  }),
  contact: z.array(z.string()),
  avatar: z.object({
    publicId: z.string().optional(),
    url: z.string(),
  }),
});

export default CommitteeSchema;

export type Committee = z.infer<typeof CommitteeSchema>;
