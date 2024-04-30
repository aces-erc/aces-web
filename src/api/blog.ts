import { NewBlog } from "@/schema/blog.zod";
import axios from "axios";
import { API } from ".";
import { BlogCardProps } from "@/app/(pages)/admin/_components/blog-card";
export const createBlog = async (newBlog: NewBlog) => {
  return new Promise((resolve, reject) => {
    axios
      .post(API.blogs, newBlog, {
        withCredentials: true,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getBlogs = async (): Promise<BlogCardProps[]> => {
  return new Promise((resolve, reject) => {
    axios
      .get(API.blogs, {
        withCredentials: true,
      })
      .then((res) => {
        resolve(res.data?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
