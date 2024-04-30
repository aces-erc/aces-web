// import Upload from "@/api/upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useMutation } from "@tanstack/react-query";
import { CloudUpload } from "lucide-react";
import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "sonner";

type UploadImageProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: (data: { url: string; publicId?: number }) => void;
  fileName: string;
};
const UploadImage = (props: UploadImageProps) => {
  const [file, setFile] = useState<Blob | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");

  // const { mutate, isPending } = useMutation({
  //   // @ts-ignore
  //   mutationFn: () => {
  //     return { hi: "there" };
  //   },
  //   onSuccess: (data) => {
  //     // @ts-ignore
  //     props.action(data);
  //     props.setIsOpen(false);
  //     toast.success("File uploaded successfully!");
  //     setFile(null);
  //     setFileUrl("");
  //   },
  //   onError: () => {
  //     toast.error("Failed to upload file!");
  //   },
  // });

  return (
    <Dialog open={props.isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-muted-foreground border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted-foreground/10 transition-colors"
              {...(fileUrl || file
                ? {
                    style: {
                      backgroundImage: fileUrl
                        ? `url(${fileUrl})`
                        : `url(${URL.createObjectURL(file as Blob)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    },
                  }
                : {})}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudUpload className="w-8 h-8 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  {file || fileUrl ? (
                    <span className="font-semibold">Click to change</span>
                  ) : (
                    <>
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {file || fileUrl
                    ? "File Selected"
                    : " SVG, PNG, JPG or GIF or anything..."}
                </p>
              </div>
              <input
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                    setFileUrl("");
                  }
                }}
                id="dropzone-file"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>

          <div className="relative w-full ">
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 py-1 bg-background font-medium text-sm">
              OR
            </span>
            <hr />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="image">Image URL</Label>
            <Input
              type="url"
              id="image"
              placeholder="https://..."
              value={fileUrl}
              onChange={(e) => {
                setFile(null);
                setFileUrl(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              props.setIsOpen(false);
              setFile(null);
              setFileUrl("");
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => {
              if (file) {
                // mutate();
              } else if (fileUrl) {
                props.action({
                  url: fileUrl,
                  publicId: undefined,
                });
                props.setIsOpen(false);
              } else {
                toast.error("Please select a file or provide a URL!");
              }
            }}
            className="min-w-20"
          >
            {/* {isPending ? <PulseLoader color="#cdcfd1" size={6} /> : "Save"} */}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImage;
