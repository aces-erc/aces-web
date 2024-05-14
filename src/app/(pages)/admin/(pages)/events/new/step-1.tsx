"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import FormErrorLine from "../../../_components/form-error-line";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import UploadImage from "../../../_components/upload-image";
import Link from "next/link";
import { NewEvent } from "@/schema/events.zod";
import { toast } from "sonner";

type Inputs = {
  title: string;
  thumbnail: string;
  startDate: string;
  endDate?: string;
  enrollLink?: string;
  location?: string;
};

type Thumbnail = {
  url: string;
  publicId?: string;
};

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setNewEvent: React.Dispatch<React.SetStateAction<any>>;
  newEvent: NewEvent | undefined;
};

const StepOne = ({ setStep, setNewEvent, newEvent }: Props) => {
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState<Thumbnail>();
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    setNewEvent((prev: any) => ({
      ...prev,
      ...data,
      thumbnail,
    }));
    setStep(2);
  };

  // Set thumbnail value when thumbnail changes and clear errors
  useEffect(() => {
    setValue("thumbnail", thumbnail?.url || "");
    clearErrors("thumbnail");
  }, [thumbnail]);

  // Reset form when mounting to newEvent
  useEffect(() => {
    if (newEvent) {
      reset({
        title: newEvent.title,
        thumbnail: newEvent.thumbnail.url,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
        enrollLink: newEvent.enrollLink,
        location: newEvent.location,
      });
      setThumbnail(newEvent.thumbnail);
    }
  }, [newEvent]);

  return (
    <>
      <UploadImage
        isOpen={isImageUploadModalOpen}
        setIsOpen={setIsImageUploadModalOpen}
        action={(data) => {
          setThumbnail(data);
        }}
        folder="events/thumbnails"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="m-auto w-[600px]">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 shadow-md">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Create a new event by filling in the details below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Title</Label>
                  <div className="flex flex-col w-full">
                    <Input
                      type="text"
                      className="w-full"
                      {...register("title", {
                        required: "Please enter a title",
                        minLength: {
                          value: 5,
                          message: "Title is too short",
                        },
                      })}
                    />
                    {errors.title && (
                      <FormErrorLine>{errors.title.message}</FormErrorLine>
                    )}
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="thumbnail">Thumbnail</Label>
                  <div className="flex flex-col w-full">
                    <div className="flex gap-4 items-center justify-between">
                      {thumbnail?.url ? (
                        <Link
                          href={thumbnail.url}
                          target="_blank"
                          className="w-full max-w-[90%] truncate border border-muted px-4 underline py-3 rounded-lg"
                        >
                          {thumbnail.url.slice(0, 50)}
                          {thumbnail.url.length > 50 ? "..." : ""}
                        </Link>
                      ) : (
                        <Input
                          disabled
                          type="text"
                          className="w-full"
                          {...register("thumbnail", {
                            required: "Please upload a thumbnail",
                          })}
                        />
                      )}
                      <Button
                        onClick={() => setIsImageUploadModalOpen(true)}
                        type="button"
                        variant="secondary"
                      >
                        <Upload className="h-5 w-5" />
                      </Button>
                    </div>
                    {errors.thumbnail && (
                      <FormErrorLine>{errors.thumbnail.message}</FormErrorLine>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="startDate">Start Date (AD) </Label>
                    <div className="flex flex-col w-full">
                      <Input
                        type="date"
                        className="w-full"
                        // Set min date to tomorrow
                        min={
                          new Date(new Date().getTime() + 86400000)
                            .toISOString()
                            .split("T")[0]
                        } // 86400000 = 1 day}
                        {...register("startDate", {
                          required: "Please enter a start date",
                          validate: (value) =>
                            new Date(value).getTime() > Date.now() ||
                            "Start date should be in the future",
                        })}
                      />
                      {errors.startDate ? (
                        <FormErrorLine>
                          {errors.startDate.message}
                        </FormErrorLine>
                      ) : (
                        errors.startDate && <span className="h-5" />
                      )}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="endDate">
                      End Date (AD){" "}
                      <span className="text-[10px] text-muted-foreground">
                        (Optional)
                      </span>
                    </Label>
                    <div className="flex flex-col w-full">
                      <Input
                        type="date"
                        className="w-full"
                        min={watch("startDate")}
                        {...register("endDate", {
                          required: false,
                        })}
                      />
                      {errors.endDate ? (
                        <FormErrorLine>{errors.endDate.message}</FormErrorLine>
                      ) : (
                        errors.startDate && <span className="h-5" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="enrollLink">
                      Enroll Link{" "}
                      <span className="text-[10px] text-muted-foreground">
                        (Optional)
                      </span>
                    </Label>
                    <div className="flex flex-col w-full">
                      <Input
                        type="text"
                        className="w-full"
                        {...register("enrollLink", {
                          required: false,
                        })}
                      />
                      {errors.enrollLink && (
                        <FormErrorLine>
                          {errors.enrollLink.message}
                        </FormErrorLine>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="location">
                      Location{" "}
                      <span className="text-[10px] text-muted-foreground">
                        (Optional)
                      </span>
                    </Label>
                    <div className="flex flex-col w-full">
                      <Input
                        type="text"
                        className="w-full"
                        {...register("location", {
                          required: false,
                        })}
                      />
                      {errors.location && (
                        <FormErrorLine>{errors.location.message}</FormErrorLine>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex items-end justify-end">
                <Button
                  disabled={Object.keys(errors).length > 0}
                  type="submit"
                  className="mt-4 min-w-32"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </>
  );
};
export default StepOne;
