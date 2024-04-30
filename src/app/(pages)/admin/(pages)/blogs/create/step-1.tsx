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
import UploadImage from "../../../_components/upload-file";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Inputs = {
  title: string;
  metaDescription: string;
  thumbnail: string;
};

type Thumbnail = {
  url: string;
  publicId?: number;
};

const StepOne = ({
  setStep,
  setNewBlog,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setNewBlog: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState<Thumbnail>();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    setNewBlog({
      ...data,
      thumbnail,
    });
    setStep(2);
  };

  useEffect(() => {
    setValue("thumbnail", thumbnail?.url || "");
    clearErrors("thumbnail");
  }, [thumbnail]);

  return (
    <>
      <UploadImage
        isOpen={isImageUploadModalOpen}
        fileName="thumbnail"
        setIsOpen={setIsImageUploadModalOpen}
        action={(data) => {
          setThumbnail(data);
        }}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="m-auto w-[600px]">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 shadow-lg">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Blog Details</CardTitle>
              <CardDescription>
                Create a new blog post to share with your audience.
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
                <div className="grid gap-3">
                  <Label htmlFor="metaDescription">
                    Meta Description (SEO)
                  </Label>
                  <div className="flex flex-col w-full">
                    <Textarea
                      className="h-32 max-h-32 min-h-32"
                      placeholder="A short description of the blog post..."
                      {...register("metaDescription", {
                        required: "Please enter a description",
                        minLength: {
                          value: 5,
                          message: "Description is too short",
                        },
                      })}
                    />
                    {errors.metaDescription && (
                      <FormErrorLine>
                        {errors.metaDescription.message}
                      </FormErrorLine>
                    )}
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
