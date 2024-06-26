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
import { deleteNoticeById } from "@/handlers/notice";

type Props = {
  title: string;
  thumbnail: {
    url: string;
  };
  slug: string;
  id: string;
};

const NoticeCard = (props: Props) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // delete blog
  const { mutate, isPending } = useMutation({
    mutationFn: deleteNoticeById,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({
        queryKey: ["notices"],
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
                the notices.
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
          className="h-full w-full object-cover object-center bg-muted"
          src={props.thumbnail.url}
        />
      </div>
      <div className="p-4">
        <Link
          href={`/notices/${props.slug}`}
          className="text-lg font-bold hover:underline"
        >
          {props.title.substring(0, 40) +
            (props.title.length > 40 ? "..." : "")}
        </Link>
      </div>
    </Card>
  );
};

export default NoticeCard;
