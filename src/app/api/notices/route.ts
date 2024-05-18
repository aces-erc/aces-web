import { db } from "@/db/db";
import { deleteImageFromCloudinary } from "@/lib/delete-image";
import { NewNoticeSchema } from "@/schema/notice.zod";
import pick from "@/utils/pick";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Retrieves a list of notices.
 * @returns A Promise that resolves to a JSON response containing the fetched notices.
 */
export const GET = async () => {
  try {
    const notices = await db.notice.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(
      {
        status: 200,
        message: "Notices fetched successfully",
        data: notices || [],
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message: "Something Went Wrong!",
        error: JSON.stringify(error),
      },
      { status: 500 }
    );
  }
};

/**
 * Handles the POST request for creating a new notice.
 * @param req - The request object.
 * @returns A JSON response indicating the status and message.
 */
export async function POST(req: Request) {
  try {
    //check if the user is an admin
    const user = await currentUser();
    if (!user || !user.id || !(user.publicMetadata.role === "admin")) {
      return NextResponse.json(
        {
          status: 401,
          message: "Unauthorized Access!",
        },
        { status: 401 }
      );
    }

    let body = await req.json();

    //see if the body is valid
    console.log(body);
    try {
      body = NewNoticeSchema.parse(body);
    } catch (error) {
      return NextResponse.json(
        {
          status: 422,
          message: "Unprocessable Entity",
          error: JSON.stringify(error),
        },
        { status: 422 }
      );
    }

    //check if the notice with the slug already exists
    let slug = body.title.toLowerCase().replace(/ /g, "-");
    const notice = await db.notice.findFirst({
      where: {
        slug,
      },
    });
    if (notice) {
      slug = `${slug}-${Date.now()}`;
    }

    //create the notice in the database
    const newNotice = await db.notice.create({
      data: {
        ...body,
        authorId: user.id,
        slug,
        thumbnail: {
          create: {
            url: body.thumbnail.url,
            publicId: body.thumbnail.publicId,
          },
        },
        images: body.images && {
          create: body.images?.map((image: any) => ({
            url: image.url,
            publicId: image.publicId,
          })),
        },
      },
    });

    return NextResponse.json(
      {
        status: 201,
        message: "Notice created successfully!",
        body: {
          ...pick(newNotice, ["id", "title", "slug"]), //return only the necessary fields
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: 500,
        message: "Something Went Wrong!",
        error: JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Deletes a notice.
 *
 * @param req - The request object.
 * @returns A JSON response indicating the status of the deletion.
 * @throws If an error occurs during the deletion process.
 */
export async function DELETE(req: Request) {
  try {
    // check if the user is an admin
    const user = await currentUser();
    if (!user || !user.id || !(user.publicMetadata.role === "admin")) {
      return NextResponse.json(
        {
          status: 401,
          message: "Unauthorized Access!",
        },
        { status: 401 }
      );
    }

    const { id } = await req.json();

    // if no id is provided
    if (!id) {
      return NextResponse.json(
        {
          status: 400,
          message: "Bad Request",
        },
        { status: 400 }
      );
    }

    const notice = await db.notice.findUnique({
      where: {
        id,
      },
    });
    console.log("🚀 ~ DELETE ~ notice:", notice);

    if (notice?.id) {
      const thumbnail = await db.noticeThumbnail.findUnique({
        where: {
          id: notice.thumbnailId,
        },
      });
      const images = await db.noticeImages.findMany({
        where: {
          noticeId: notice.id,
        },
      });
      await db.notice.delete({
        where: {
          id,
        },
      });
      if (thumbnail) {
        await db.noticeThumbnail.delete({
          where: {
            id: thumbnail.id,
          },
        });
        if (thumbnail.publicId) {
          await deleteImageFromCloudinary(thumbnail.publicId);
        }
      }
      if (images) {
        images.forEach(async (image) => {
          await db.noticeImages.delete({
            where: {
              id: image.id,
            },
          });
          if (image.publicId) {
            await deleteImageFromCloudinary(image.publicId);
          }
        });
      }
      return NextResponse.json(
        {
          status: 200,
          message: "Notice deleted successfully!",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        status: 500,
        message: "Something Went Wrong!",
        error: JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}
