"use client";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";

const BlogCreatePage = () => {
  useEffect(() => {
    // this is a hack to style the toolbar of the markdown editor
    const addStyleToToolBar = () => {
      const toolbar = document.querySelector(
        ".w-md-editor>.w-md-editor-toolbar"
      );
      if (!toolbar) return;
      const uls = toolbar.querySelectorAll("ul");
      uls?.forEach((ul) => {
        ul.style.padding = "0.4rem 0.6rem";
        const lis = ul.querySelectorAll("li");
        lis?.forEach((li) => {
          li.style.height = "fit-content";
          li.style.width = "fit-content";
          const btn = li.querySelector("button");
          if (btn) {
            btn.style.display = "flex";
            btn.style.justifyContent = "center";
            btn.style.alignItems = "center";
            btn.style.padding = "0.4rem o.6rem";
            btn.style.marginRight = "0.4rem";
            const svg = btn.querySelector("svg");
            if (svg) {
              svg.style.width = "1rem";
              svg.style.height = "1rem";
            }
          }
        });
      });
    };
    addStyleToToolBar();
  }, []);
  const [value, setValue] = useState("*Your blog goes here.......*\n---");
  return (
    <div className="container" data-color-mode="light">
      <MDEditor
        className="!h-[80vh]"
        value={value}
        onChange={(val) => setValue(val!)}
      />
    </div>
  );
};
export default BlogCreatePage;
