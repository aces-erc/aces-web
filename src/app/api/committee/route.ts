import { db } from "@/db/db";
import { NextResponse } from "next/server";
import CommitteeSchema from "@/schema/committee.zod";
import { currentUser } from "@clerk/nextjs/server";

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
    console.log(body);
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

export const GET = async (req: Request) => {
  const committeeMembers = await db.committeeMembers.findMany({
    include: {
      avatar: true,
    },
  });
  if (committeeMembers === null || committeeMembers.length === 0) {
    return NextResponse.json(
      {
        status: 404,
        message: "No committee members found",
      },
      { status: 404 }
    );
  }
  return NextResponse.json(
    {
      status: 200,
      message: "Committee members fetched successfully",
      body: committeeMembers,
    },
    { status: 200 }
  );
};

export const DELETE = async (req: Request) => {
  //TODO: Add authentication check using clerk while implementing ui and delete image in cloudinary too
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
};
