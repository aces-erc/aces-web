import { db } from "@/db/db";
import { NewBlogSchema } from "@/schema/blog.zod";
import pick from "@/utils/pick";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Retrieves a list of blogs.
 * @returns A Promise that resolves to a JSON response containing the fetched blogs.
 */
export const GET = async () => {
  try {
    const blogs = await db.blog.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        metaDescription: true,
        thumbnail: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(
      {
        status: 200,
        message: "Blogs fetched successfully",
        data: blogs || [],
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
 * Handles the POST request for creating a new blog.
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
      body = NewBlogSchema.parse(body);
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

    //check if the blog with the slug already exists
    let slug = body.title.toLowerCase().replace(/ /g, "-");
    const blog = await db.blog.findFirst({
      where: {
        slug,
      },
    });
    if (blog) {
      slug = `${slug}-${Date.now()}`;
    }

    //create the blog in the database
    const newBlog = await db.blog.create({
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
        message: "Blog created successfully",
        body: {
          ...pick(newBlog, ["id", "title", "slug"]), //return only the necessary fields
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
 * Deletes a blog.
 *
 * @param req - The request object.
 * @returns A JSON response indicating the status of the deletion.
 * @throws If an error occurs during the deletion process.
 */
export async function DELETE(req: Request) {
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

    // delete the blog
    await db.blog.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        status: 200,
        message: "Blog deleted successfully",
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
}
