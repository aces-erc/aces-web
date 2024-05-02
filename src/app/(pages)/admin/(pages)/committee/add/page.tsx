"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Committee } from "@/schema/committee.zod";
import { useForm } from "react-hook-form";
import FormErrorLine from "../../../_components/form-error-line";
import { useState } from "react";
import Link from "next/link";
import { Trash, Upload } from "lucide-react";
import UploadImage from "../../../_components/upload-image";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCommitteeMember } from "@/api/committee";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";

const AddCommittee = () => {
  const queryClient = useQueryClient();
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);
  const [contact, setContact] = useState<Committee["contact"]>([]);
  const [avatar, setAvatar] = useState<Committee["avatar"]>();
  const [contactLink, setContactLink] = useState<string>("");
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Committee>();

  const onSubmit = (data: Committee) => {
    if (!avatar) {
      return toast.error("Please upload a avatar");
    }
    if (contact.length === 0) {
      return toast.error("Please add at least one contact");
    }
    mutate({
      ...data,
      contact,
      avatar,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: addCommitteeMember,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["committee"],
        })
        .then(() => {
          toast.success("Committee member added successfully");
          router.push("/admin/committee");
        });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-[calc(100vh-80px)] flex items-center justify-center"
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardDescription>Add a new committee member!</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <div className="flex flex-col">
                <Input
                  placeholder="Tilak Thapa"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
                {errors.name && (
                  <FormErrorLine>{errors.name.message}</FormErrorLine>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <div className="flex flex-col">
                <Input
                  placeholder="President"
                  {...register("position", {
                    required: "Position is required",
                  })}
                />
                {errors.position && (
                  <FormErrorLine>{errors.position.message}</FormErrorLine>
                )}
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="avatar">Avatar</Label>
              <div className="flex flex-col w-full">
                <div className="flex gap-4 items-center justify-between">
                  {avatar?.url ? (
                    <Link
                      href={avatar.url}
                      target="_blank"
                      className="w-full max-w-[330px] truncate border border-muted px-4 underline py-3 rounded-lg"
                    >
                      {avatar.url.slice(0, 50)}
                      {avatar.url.length > 50 ? "..." : ""}
                    </Link>
                  ) : (
                    <Input
                      disabled
                      type="text"
                      placeholder="https://example.com/avatar.png"
                      className="w-full"
                      {...register("avatar", {
                        required: "Please upload a avatar",
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
                {errors.avatar && (
                  <FormErrorLine>{errors.avatar.message}</FormErrorLine>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Contact</Label>
              <div className="flex flex-col">
                <Input
                  value={contactLink}
                  onChange={(e) => setContactLink(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = contactLink.trim();
                      if (!val || !val.startsWith("http")) {
                        toast.error("Enter a valid URL");
                        return;
                      }
                      if (contact.includes(val)) {
                        toast.error("Contact already added");
                        return;
                      }
                      setContact((prev) => [...prev, val]);
                      setContactLink("");
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-2 max-h-[100px] overflow-y-auto hide-scrollbar">
                {contact.map((contact, index) => (
                  <div key={index} className="flex gap-4 justify-between">
                    <Link
                      href={contact}
                      target="_blank"
                      className="w-full text-xs max-w-[330px] truncate border border-muted px-3 underline py-2 rounded-lg"
                    >
                      {contact.slice(0, 50)}
                      {contact.length > 50 ? "..." : ""}
                    </Link>
                    <Button
                      onClick={() => {
                        setContact((prev) => prev.filter((c) => c !== contact));
                      }}
                      variant="secondary"
                      className="text-destructive px-4 py-2"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              {isPending ? <PulseLoader color="#cdcfd1" size={6} /> : "Add"}
            </Button>
          </CardFooter>
        </Card>
      </form>
      <UploadImage
        isOpen={isImageUploadModalOpen}
        action={(avatar: any) => {
          setAvatar(avatar);
          setIsImageUploadModalOpen(false);
        }}
        setIsOpen={setIsImageUploadModalOpen}
        folder="committee"
      />
    </>
  );
};

export default AddCommittee;
