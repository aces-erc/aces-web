import { DeleteImage } from "@/lib/delete-image";
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

    const data: any = await UploadImage(image, "images");

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

export const DELETE = async (req: NextRequest) => {
try{
  const { publicId } = await req.json();
  const result = await DeleteImage(publicId);
  return NextResponse.json(
    {
      data: result,
      message: "Image deleted successfully",
    },
    {
      status: 200,
    }
  );}
  catch(error){
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

// Note :
// while deleting the image you require the publicId of the image  for which either you can store public id in the database or you can extract the public id from the cloudinary api by using the image url.
// `http://res.cloudinary.com/detlvdnwg/image/upload/v1714493345/images/hpvlc2kgrlyjodi155mm.jpg`
// in this url the public id is `images/hpvlc2kgrlyjodi155mm` which is the part of the url after `upload/v` and before the `.jpg` extension.
// you can extract the public id by using the following code.
// const public_id = url.split('upload/v')[1].split('.jpg')[0]
// so you can use both methods either store the public id in the database or extract the public id from the image url.
// for more information you can visit cloudinary documentation.
