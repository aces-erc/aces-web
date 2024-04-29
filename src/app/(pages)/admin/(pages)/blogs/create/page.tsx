"use client";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

const BlogCreatePage = () => {
  const [value, setValue] = useState("**Hello world!!!**");
  return (
    <div className="container">
      <MDEditor value={value} onChange={(val) => setValue(val!)} />
      <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} />
    </div>
  );
};
export default BlogCreatePage;
