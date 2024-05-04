"use client";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import { ArrowBigLeft, Clipboard, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import UploadImage from "../../../_components/upload-image";
import copyToClipboard from "@/utils/copy-to-clipboard";
import { useMutation } from "@tanstack/react-query";
import { deleteImage } from "@/api/images";
import { toast } from "sonner";
import { PulseLoader } from "react-spinners";
import { NewBlog } from "@/schema/blog.zod";

type Props = {
  onSubmit: Function;
  isPending: boolean;
  setStep: Function;
  newBlog: NewBlog;
  setVal: Function;
  setImages: Function;
};

const WriteBlog = ({
  onSubmit,
  isPending,
  setStep,
  newBlog: { body, images },
  setVal,
  setImages,
}: Props) => {
  // this is a hack to style the toolbar of the markdown editor
  useEffect(() => {
    const addStyleToToolBar = () => {
      const toolbar = document.querySelector(
        ".w-md-editor>.w-md-editor-toolbar"
      );
      if (!toolbar) return;
      const uls = toolbar.querySelectorAll("ul");
      uls?.forEach((ul) => {
        ul.style.padding = "0.4rem 0.6rem";
        const lis = ul.querySelectorAll("li");
        lis?.forEach((li) => {
          li.style.height = "fit-content";
          li.style.width = "fit-content";
          const btn = li.querySelector("button");
          if (btn) {
            btn.style.display = "flex";
            btn.style.justifyContent = "center";
            btn.style.alignItems = "center";
            btn.style.padding = "0.4rem o.6rem";
            btn.style.marginRight = "0.4rem";
            const svg = btn.querySelector("svg");
            if (svg) {
              svg.style.width = "1rem";
              svg.style.height = "1rem";
            }
          }
        });
      });
    };
    addStyleToToolBar();
  }, []);

  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);

  const { mutate: deleteImageMutate } = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      toast.success("Image deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete image");
    },
  });

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center w-full gap-4 px-8">
          <button
            onClick={() => setStep(1)}
            className="p-2 rounded-full bg-muted-foreground/10 hover:bg-muted-foreground/20 transition-colors"
          >
            <ArrowBigLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-4 items-center">
            <Button
              variant="secondary"
              onClick={() => setIsImageUploadModalOpen(true)}
            >
              Upload Image
            </Button>
            <Button
              disabled={isPending}
              onClick={() => onSubmit()}
              className="!self-end px-8"
            >
              {isPending ? <PulseLoader color="#cdcfd1" size={6} /> : "Publish"}
            </Button>
          </div>
        </div>
        <div className="container" data-color-mode="light">
          <MDEditor
            className="!h-[70vh]"
            value={body}
            onChange={(val) => setVal(val!)}
          />
        </div>
        {images && images.length > 0 && (
          <div className="flex flex-col gap-3 px-8">
            <h4 className="text-lg font-semibold text-muted-foreground">
              Uploaded Images
            </h4>
            <hr />
            <div className="flex gap-4 flex-wrap">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-52 h-52 bg-muted rounded-md"
                >
                  <img
                    src={image.url}
                    alt="blog-image"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="flex flex-col gap-3 absolute top-1 right-1">
                    <button
                      onClick={() => {
                        setImages(
                          images.filter((img) => img.url !== image.url)
                        );
                        if (image.publicId)
                          deleteImageMutate(image.publicId.toString());
                      }}
                      className="p-1 bg-white rounded-full text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        copyToClipboard(
                          image.url,
                          "Image URL copied to clipboard"
                        );
                      }}
                      className="p-1 bg-white rounded-full text-muted-foreground hover:bg-muted-foreground/20 transition-colors"
                    >
                      <Clipboard className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <UploadImage
        action={(data) => {
          if (images) {
            setImages([...images, data]);
          } else {
            setImages([data]);
          }
          copyToClipboard(data.url, "Image URL copied to clipboard");
        }}
        isOpen={isImageUploadModalOpen}
        setIsOpen={setIsImageUploadModalOpen}
        folder="blogs/images"
      />
    </>
  );
};
export default WriteBlog;
