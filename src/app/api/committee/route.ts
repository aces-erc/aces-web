import { db } from "@/db/db";
import { NextResponse } from "next/server";
import CommitteeSchema from "@/schema/committee.zod";
import { currentUser } from "@clerk/nextjs/server";
import { deleteImageFromCloudinary } from "@/lib/delete-image";

/**
 * Retrieves the committee members from the database.
 */
export const GET = async () => {
  try {
    const committeeMembers = await db.committeeMembers.findMany({
      include: {
        avatar: true,
      },
    });

    return NextResponse.json(
      {
        status: 200,
        message: "Committee members fetched successfully",
        data: committeeMembers || [],
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
 * Handles the POST request for creating a committee member.
 * @param req - The request object.
 * @returns A JSON response indicating the status and message.
 */
export const POST = async (req: Request) => {
  //check if the user is an admin
  try {
    const user = await currentUser();
    if (!user || !user.id || !(user.publicMetadata.role === "admin")) {
      return NextResponse.json(
        {
          status: 401,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    let body = await req.json();
    try {
      body = CommitteeSchema.parse(body);
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
    await db.committeeMembers.create({
      data: {
        ...body,
        avatar: {
          create: {
            publicId: body.avatar.publicId,
            url: body.avatar.url,
          },
        },
      },
    });
    return NextResponse.json(
      {
        status: 201,
        message: "Committee member created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
        error: JSON.stringify(error),
      },
      { status: 500 }
    );
  }
};

/**
 * Deletes a committee member.
 * @param req - The request object.
 * @returns A JSON response indicating the status of the deletion.
 */
export const DELETE = async (req: Request) => {
  try {
    const user = await currentUser();
    if (!user || !user.id || !(user.publicMetadata.role === "admin")) {
      return NextResponse.json(
        {
          status: 401,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }
    const body = await req.json();
    const { id } = body;
    const committeeMember = await db.committeeMembers.findUnique({
      where: {
        id: id,
      },
    });
    if (committeeMember === null) {
      return NextResponse.json(
        {
          status: 404,
          message: "Committee member not found",
        },
        { status: 404 }
      );
    }

    const avatarId = committeeMember.avatarId;
    const avatar = await db.avatar.findUnique({
      where: {
        id: avatarId,
      },
    });

    //delete the image from cloudinary
    if (avatar?.publicId) {
      deleteImageFromCloudinary(avatar.publicId);
    }

    await db.committeeMembers.delete({
      where: {
        id: id,
      },
    });
    await db.avatar.delete({
      where: {
        id: committeeMember.avatarId,
      },
    });

    return NextResponse.json(
      {
        status: 200,
        message: "Committee member deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
        error: JSON.stringify(error),
      },
      { status: 500 }
    );
  }
};
