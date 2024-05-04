import { deleteImageFromCloudinary } from "@/lib/delete-image";
import { UploadImage } from "@/lib/upload-image";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the POST request for uploading an image.
 * @param req - The NextRequest object representing the incoming request.
 * @returns A NextResponse object with the JSON response containing the uploaded image data and a success message.
 */
export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as unknown as File;
    const folder = formData.get("folder") as string;

    const data: any = await UploadImage(image, folder ?? "images");

    return NextResponse.json(
      {
        data,
        message: "Image uploaded successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message: JSON.stringify(error),
      },
      {
        status: 500,
      }
    );
  }
};

/**
 * Deletes an image from Cloudinary.
 * @param req - The NextRequest object containing the request data.
 * @returns A NextResponse object with the result of the deletion operation.
 */
export const DELETE = async (req: NextRequest) => {
  try {
    const { publicId } = await req.json();
    const result = await deleteImageFromCloudinary(publicId);
    return NextResponse.json(
      {
        data: result,
        message: "Image deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message: JSON.stringify(error),
      },
      {
        status: 500,
      }
    );
  }
};
