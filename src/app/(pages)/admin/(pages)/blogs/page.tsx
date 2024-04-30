"use client";
import { getBlogs } from "@/api/blog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { FilePlus } from "lucide-react";
import Link from "next/link";
import BlogCard, { BlogCardProps } from "../../_components/blog-card";

const BlogsPage = () => {
  const { data, isLoading, isError } = useQuery<BlogCardProps[]>({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong...</div>;
  console.log(data);
  return (
    <div>
      <Link href="/admin/blogs/create">
        <Button>
          <span>Add Blog</span>
          <FilePlus className="h-5 w-5 ml-2" />
        </Button>
      </Link>
      <h2>Blogs</h2>
      <div className="flex gap-4 flex-wrap">
        {data?.map((blog) => (
          <BlogCard {...blog} key={blog.id} />
        ))}
      </div>
    </div>
  );
};
export default BlogsPage;
