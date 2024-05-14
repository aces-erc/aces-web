import { db } from "@/db/db";
import { NewEventsSchema } from "@/schema/events.zod";
import pick from "@/utils/pick";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const events = await db.events.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        startDate: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!events) {
      return NextResponse.json(
        {
          status: 404,
          message: "No events found",
          data: [],
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        status: 200,
        message: "Events fetched successfully",
        data: events,
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
      body = NewEventsSchema.parse(body);
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

    //check if the event with the slug already exists
    let slug = body.title.toLowerCase().replace(/ /g, "-");
    const event = await db.events.findFirst({
      where: {
        slug,
      },
    });
    if (event) {
      slug = `${slug}-${Date.now()}`;
    }

    //create the event in the database
    const newEvent = await db.events.create({
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
        message: "event created successfully!",
        body: {
          ...pick(newEvent, ["id", "title", "slug"]), //return only the necessary fields
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

    // delete the notice
    await db.events.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        status: 200,
        message: "Events deleted successfully",
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
