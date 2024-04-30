import { db } from "@/db/db";
import { newBlogSchema } from "@/schema/blog.zod";
import pick from "@/utils/pick";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    //check if the user is an admin
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
    //see if the body is valid
    try {
      body = newBlogSchema.parse(body);
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

    console.log("🚀 ~ POST ~ body:", body);

    const newBlog = await db.blog.create({
      data: {
        ...body,
        authorId: user.id,
        slug: body.title.toLowerCase().replace(/ /g, "-"),
        thumbnail: {
          create: {
            url: body.thumbnail.url,
            publicId: body.thumbnail.publicId, // assuming you have this field in the request body
          },
        },
      },
    });
    return NextResponse.json(
      {
        status: 201,
        message: "Blog created successfully",
        body: {
          ...pick(newBlog, ["id", "title", "slug"]),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return new NextResponse("Something Went Wrong!", { status: 500 });
  }
}
