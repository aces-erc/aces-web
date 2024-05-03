import { z } from "zod";

const CommitteeSchema = z.object({
  name: z.string(),
  position: z.string(),
  contact: z.array(z.string()),
  avatar: z.object({
    publicId: z.string().optional(),
    url: z.string(),
  }),
});

export default CommitteeSchema;

export type Committee = z.infer<typeof CommitteeSchema>;
