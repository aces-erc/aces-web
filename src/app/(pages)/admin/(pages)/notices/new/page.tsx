/**
 * This is the page where the user can create a new notice.
 */
"use client";
import { useState } from "react";
import StepOne from "./step-1";
import WriteNotice from "./write-notice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NewNotice } from "@/schema/notice.zod";
import { createNotice } from "@/handlers/notice";

const CreateBlog = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [newNotice, setNewNotice] = useState<NewNotice>({
    title: "",
    body: "*Your notice goes here.......*\n---",
    thumbnail: { url: "" },
  });

  const [step, setStep] = useState(1);

  // Mutation to create a new blog
  const { isPending, mutate } = useMutation({
    mutationFn: createNotice,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["notices"],
        })
        .then(() => {
          toast.success("Notice created successfully");
          router.push("/admin/notices");
        });
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });

  if (step === 1)
    return (
      <StepOne
        setStep={setStep}
        setNewNotice={setNewNotice}
        newNotice={newNotice}
      />
    );
  if (step === 2)
    return (
      <WriteNotice
        onSubmit={() => {
          if (newNotice) {
            mutate({ ...newNotice });
          }
        }}
        isPending={isPending}
        setStep={setStep}
        newNotice={newNotice as NewNotice}
        setVal={(val: string) => {
          setNewNotice({ ...newNotice, body: val } as NewNotice);
        }}
        setImages={(images: any) => {
          setNewNotice({ ...newNotice, images } as NewNotice);
        }}
      />
    );
};
export default CreateBlog;
