import { db } from "@/db/db";
import { NewContactSchema } from "@/schema/contact.zod";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    let body = await req.json();
    try {
      body = NewContactSchema.parse(body);
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

    await db.contact.create({
      data: {
        ...body,
      },
    });
    return NextResponse.json(
      {
        status: 201,
        message: "Message sent successfully!",
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
  try {
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
    const contacts = await db.contact.findMany();
    return NextResponse.json(
      {
        status: 200,
        data: contacts,
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
export const DELETE = async (req: Request) => {
  try {
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
    await db.contact.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(
      {
        status: 200,
        message: "Contact deleted successfully",
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
