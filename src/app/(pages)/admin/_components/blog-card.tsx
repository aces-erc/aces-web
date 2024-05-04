import { deleteBlogById } from "@/api/blog";
import { Card } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PulseLoader } from "react-spinners";

type Props = {
  title: string;
  metaDescription: string;
  thumbnail: {
    url: string;
  };
  slug: string;
  id: string;
};

const BlogCard = (props: Props) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // delete blog
  const { mutate, isPending } = useMutation({
    mutationFn: deleteBlogById,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });
      toast.success(msg);
      setIsOpen(false);
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
  return (
    <Card className="w-full relative group max-w-[370px]">
      {/* // edit delete buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 scale-0 group-hover:scale-100 transition-transform">
        <button
          onClick={() => {
            toast.error("Edit feature is not available yet.");
          }}
          className="bg-muted/40 p-1 rounded-full"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <AlertDialog open={isOpen}>
          <AlertDialogTrigger
            className="bg-destructive/40 p-1 rounded-full"
            onClick={() => setIsOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                <span className="italic font-medium ">{props.title}</span> from
                the blogs.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsOpen(false)}>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={() => {
                  mutate(props.id);
                }}
              >
                {isPending ? (
                  <PulseLoader color="#cdcfd1" size={6} />
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="aspect-[9/5] overflow-hidden rounded-t-lg">
        <img
          alt={props.title}
          className="h-full w-full object-cover object-center"
          src={props.thumbnail.url}
        />
      </div>
      <div className="p-4">
        <Link
          href={`/blogs/${props.slug}`}
          className="text-lg font-bold hover:underline"
        >
          {props.title.substring(0, 40) +
            (props.title.length > 40 ? "..." : "")}
        </Link>
        <p className="mt-1 text-muted-foreground">
          {props.metaDescription.substring(0, 100)}
          {props.metaDescription.length > 100 ? "..." : ""}
        </p>
      </div>
    </Card>
  );
};

export default BlogCard;
