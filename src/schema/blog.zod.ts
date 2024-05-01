import { z } from "zod";

export const newBlogSchema = z.object({
  title: z.string(),
  body: z.string(),
  metaDescription: z.string(),
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
export type NewBlog = z.infer<typeof newBlogSchema>;
