/**
 * This is the page where the user can create a new blog.
 */
"use client";
import { useEffect, useState } from "react";
import StepOne from "./step-1";
import { NewBlog } from "@/schema/blog.zod";
import WriteBlog from "./write-blog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBlog } from "@/handlers/blog";

const CreateBlog = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [newBlog, setNewBlog] = useState<NewBlog>({
    title: "",
    metaDescription: "",
    body: "*Your blog goes here.......*\n---",
    thumbnail: { url: "" },
  });

  const [step, setStep] = useState(1);

  // Mutation to create a new blog
  const { isPending, mutate } = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["blogs"],
        })
        .then(() => {
          toast.success("Blog created successfully");
          router.push("/admin/blogs");
        });
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });

  if (step === 1)
    return (
      <StepOne setStep={setStep} setNewBlog={setNewBlog} newBlog={newBlog} />
    );
  if (step === 2)
    return (
      <WriteBlog
        onSubmit={() => {
          if (newBlog) {
            mutate({ ...newBlog });
          }
        }}
        isPending={isPending}
        setStep={setStep}
        newBlog={newBlog as NewBlog}
        setVal={(val: string) => {
          setNewBlog({ ...newBlog, body: val } as NewBlog);
        }}
        setImages={(images: any) => {
          setNewBlog({ ...newBlog, images } as NewBlog);
        }}
      />
    );
};
export default CreateBlog;
