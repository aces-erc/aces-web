import { Card } from "@/components/ui/card";
import Image from "next/image";

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
    <Card className="w-full max-w-md">
      <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
        <img
          alt={props.title}
          className="h-full w-full object-cover object-center"
          height={300}
          src={props.thumbnail.url}
          style={{
            aspectRatio: "400/300",
            objectFit: "cover",
            objectPosition: "center",
          }}
          width={400}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold">{props.title}</h3>
        <p className="mt-2 text-muted-foreground">{props.metaDescription}</p>
      </div>
    </Card>
  );
};

export default BlogCard;
