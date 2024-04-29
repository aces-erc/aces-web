import { db } from "@/db/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, body } = await req.json();
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const newBlog = await db.blog.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/ /g, "-"),
        body,
        authorId: userId,
      },
    });
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return new NextResponse("Something Went Wrong!", { status: 500 });
  }
}
