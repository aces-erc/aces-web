import { Card } from "@/components/ui/card";
import { Pencil, Trash, Trash2 } from "lucide-react";
import Link from "next/link";

export type BlogCardProps = {
  title: string;
  metaDescription: string;
  thumbnail: {
    url: string;
  };
  slug: string;
  id: string;
};

const BlogCard = (props: BlogCardProps) => {
  return (
    <Card className="w-full relative group max-w-[370px]">
      {/* // edit delete buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 scale-0 group-hover:scale-100 transition-transform">
        <button className="bg-muted/40 p-1 rounded-full">
          <Pencil className="w-4 h-4" />
        </button>
        <button className="bg-destructive/40 p-1 rounded-full">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="aspect-[9/5] overflow-hidden rounded-t-lg">
        <img
          alt={props.title}
          className="h-full w-full object-cover object-center"
          src={props.thumbnail.url}
        />
      </div>
      <div className="p-4">
        <Link
          href={`/blogs/${props.slug}`}
          className="text-lg font-bold hover:underline"
        >
          {props.title.substring(0, 40) +
            (props.title.length > 40 ? "..." : "")}
        </Link>
        <p className="mt-1 text-muted-foreground">
          {props.metaDescription.substring(0, 100)}
          {props.metaDescription.length > 100 ? "..." : ""}
        </p>
      </div>
    </Card>
  );
};

export default BlogCard;
