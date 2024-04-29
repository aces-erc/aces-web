import { Button } from "@/components/ui/button";
import { FilePlus, Plus } from "lucide-react";
import Link from "next/link";

const BlogsPage = () => {
  return (
    <div>
      <Link href="/admin/blogs/create">
        <Button>
          <span>Add Blog</span>
          <FilePlus className="h-5 w-5 ml-2" />
        </Button>
      </Link>
      <h2>Blogs</h2>
      <p>Manage blogs here</p>
    </div>
  );
};
export default BlogsPage;
