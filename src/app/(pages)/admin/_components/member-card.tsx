import { Committee } from "@/schema/committee.zod";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommitteeMember } from "@/handlers/committee";
import { toast } from "sonner";
import { useState } from "react";
import { PulseLoader } from "react-spinners";

const MemberCard = ({ committee }: { committee: Committee }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: deleteCommitteeMember,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["committee"],
        })
        .then(() => {
          toast.success(`${committee.name} deleted from committee`);
          setIsOpen(false);
        });
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
  return (
    <>
      <div className="bg-white rounded-lg shadow-md py-3 px-6 w-72 relative group">
        <div className="flex items-center gap-4">
          <img
            src={committee.avatar.url}
            alt={committee.name}
            className="w-16 h-16 rounded-full object-cover origin-center bg-muted"
          />
          <div>
            <h2 className="text-lg font-medium">{committee.name}</h2>
            <p className="text-sm text-muted-foreground">
              {committee.position}
            </p>
          </div>
        </div>
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 scale-0 group-hover:scale-100 transition-transform">
          <button
            onClick={() => {
              toast.error("Edit feature is not available yet.");
            }}
            className="bg-muted/40 p-1 rounded-full"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <AlertDialog open={isOpen}>
            <AlertDialogTrigger
              className="bg-destructive/40 p-1 rounded-full"
              onClick={() => setIsOpen(true)}
            >
              <Trash2 className="w-3 h-3" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete{" "}
                  <span className="italic font-medium ">{committee.name}</span>{" "}
                  from the committee.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsOpen(false)}>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => {
                    mutate(committee.id);
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
      </div>
    </>
  );
};
export default MemberCard;
