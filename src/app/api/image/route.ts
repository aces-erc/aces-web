import { UploadImage } from "@/lib/upload-image";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the POST request for uploading an image.
 * @param req - The NextRequest object representing the incoming request.
 * @returns A NextResponse object with the JSON response containing the uploaded image data and a success message.
 */
export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const image = formData.get("image") as unknown as File;

  const data: any = await UploadImage(image, "images");

  return NextResponse.json(
    {
      msg: { data, message: "Image uploaded successfully" },
    },
    {
      status: 200,
    }
  );
};
