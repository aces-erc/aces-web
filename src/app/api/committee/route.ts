import { db } from "@/db/db";
import { CommitteeSchema } from "@/schema/committee.zod";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  //TODO: Add authentication check using clerk while implementing ui
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
  const newCommitteeMember = await db.committeeMembers.create({
    data: {
      ...body,
      CommitteeMembersAvatar: {
        create: {
          publicId: body.CommitteeMembersAvatar.publicId,
          url: body.CommitteeMembersAvatar.url,
        },
      },
    },
  });
  return NextResponse.json(
    {
      status: 201,
      message: "Committee member created successfully",
      body: newCommitteeMember,
    },
    { status: 201 }
  );
};

// Sample request body
// {
//   "name": "John Doe",
//   "position": "Chairperson",
//   "contact": [
//       "john@example.com",
//       "+1234567890"
//   ],
//   "CommitteeMembersAvatar": {
//       "publicId": "abc123",
//       "url": "https://res.cloudinary.com/example/image/upload/v123456789/avatar.jpg"
//   }
// }

export const GET = async (req: Request) => {
  const committeeMembers = await db.committeeMembers.findMany({
    include: {
      CommitteeMembersAvatar: true,
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
  await db.committeeMembersAvatar.delete({
    where: {
      id: committeeMember.CommitteeMembersAvatarId,
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
