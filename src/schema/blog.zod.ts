import { z } from "zod";

export const newBlogSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters long",
  }),
  body: z.string().min(10, {
    message: "Body must be at least 10 characters long",
  }),
  metaDescription: z.string().min(10, {
    message: "Body must be at least 10 characters long",
  }),
  thumbnail: z.object({
    url: z.string().url({
      message: "Invalid image URL",
    }),
    publicId: z.number().optional(),
  }),
  images: z
    .array(
      z.object({
        url: z.string().url({
          message: "Invalid image URL",
        }),
        publicId: z.number().optional(),
      })
    )
    .optional(),
});

//types
export type NewBlog = z.infer<typeof newBlogSchema>;
