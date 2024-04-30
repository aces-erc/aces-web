"use client";
import { useState } from "react";
import StepOne from "./step-1";
import { NewBlog } from "@/schema/blog.zod";
import WriteBlog from "./write-blog";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBlog } from "@/api/blog";
const CreateBlog = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { isPending, mutate } = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      toast.success("Blog created successfully");
      router.push("/admin/blogs");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const [newBlog, setNewBlog] = useState<NewBlog>();
  if (step === 1) return <StepOne setStep={setStep} setNewBlog={setNewBlog} />;
  if (step === 2)
    return (
      <WriteBlog
        onSubmit={(value: string) => {
          if (newBlog) {
            mutate({ ...newBlog, body: value });
          }
        }}
        isPending={isPending}
      />
    );
};
export default CreateBlog;
