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
  const [newBlog, setNewBlog] = useState<NewBlog>();
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
