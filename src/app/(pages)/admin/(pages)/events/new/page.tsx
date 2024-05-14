/**
 * This is the page where the user can create a new event.
 */
"use client";
import { useState } from "react";
import StepOne from "./step-1";
import WriteBlog from "./write-event-body";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBlog } from "@/handlers/blog";
import { NewEvent } from "@/schema/events.zod";
import { createEvent } from "@/handlers/events";

const CreateBlog = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: "",
    body: "*Your event details goes here.......*\n---",
    thumbnail: { url: "" },
    startDate: "",
  });

  const [step, setStep] = useState(1);

  // Mutation to create a new event
  const { isPending, mutate } = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["events"],
        })
        .then(() => {
          toast.success("Event created successfully!");
          router.push("/admin/events");
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
        setNewEvent={setNewEvent}
        newEvent={newEvent}
      />
    );
  if (step === 2)
    return (
      <WriteBlog
        onSubmit={() => {
          if (newEvent) {
            mutate({ ...newEvent });
          }
        }}
        isPending={isPending}
        setStep={setStep}
        newEvent={newEvent as NewEvent}
        setVal={(val: string) => {
          setNewEvent({ ...newEvent, body: val } as NewEvent);
        }}
        setImages={(images: any) => {
          setNewEvent({ ...newEvent, images } as NewEvent);
        }}
      />
    );
};
export default CreateBlog;
