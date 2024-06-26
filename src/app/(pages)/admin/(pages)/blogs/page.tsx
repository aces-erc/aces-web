/**
 * Show all blogs created by the user
 */

"use client";
import { getBlogs } from "@/handlers/blog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { FilePlus } from "lucide-react";
import Link from "next/link";
import BlogCard from "../../_components/blog-card";
import Loading from "../../_components/loading";
import SomethingWentWrong from "../../_components/something-went-wrong";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import search from "@/utils/search";
import { IBlog } from "@/types/blog.types";

const BlogsPage = () => {
  const [filteredData, setFilteredData] = useState<IBlog[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch all blogs
  const { data, isLoading, isError } = useQuery<IBlog[]>({
    queryKey: ["blogs"],
    queryFn: getBlogs,
    staleTime: Infinity,
  });

  // Filter blogs based on search query
  useEffect(() => {
    if (data) {
      setFilteredData(
        search<IBlog>(data, searchQuery, ["title", "metaDescription"])
      );
    }
  }, [data, searchQuery]);

  //Show loading or error message accordingly
  if (isLoading) return <Loading />;
  if (isError) return <SomethingWentWrong />;

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg">
      <div className="flex justify-between">
        <Input
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          placeholder="Search Blogs"
          className="max-w-80"
        />
        <Link href="/admin/blogs/new">
          <Button>
            <span>Add Blog</span>
            <FilePlus className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
      <hr />
      <h2 className="text-2xl font-semibold text-primary">All Blogs</h2>
      <div className="flex gap-4 flex-wrap">
        {filteredData && filteredData?.length > 0 ? (
          filteredData?.map((blog) => <BlogCard {...blog} key={blog.id} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-96 w-full">
            <p className="text-muted-foreground">No blogs found!</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default BlogsPage;
