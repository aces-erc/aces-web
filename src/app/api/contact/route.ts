import { db } from "@/db/db";
import { NewContactSchema } from "@/schema/contact.zod";
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
