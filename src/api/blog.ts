import { NewBlog } from "@/schema/blog.zod";
import axios from "axios";
import { API } from ".";
import { Blog } from "@/types/blog.types";
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

export const getBlogs = async (): Promise<Blog[]> => {
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
