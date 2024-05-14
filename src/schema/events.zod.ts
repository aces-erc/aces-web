import { z } from "zod";

export const NewEventsSchema = z.object({
  title: z.string(),
  body: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  enrollLink: z.string().optional(),
  location: z.string().optional(),
  thumbnail: z.object({
    url: z.string().url({
      message: "Invalid image URL",
    }),
    publicId: z.string().optional(),
  }),
  images: z
    .array(
      z.object({
        url: z.string().url({
          message: "Invalid image URL",
        }),
        publicId: z.string().optional(),
      })
    )
    .optional(),
});

//types
export type NewEvent = z.infer<typeof NewEventsSchema>;
