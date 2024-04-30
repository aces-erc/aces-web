import { NewBlog } from "@/schema/blog.zod";
import axios from "axios";
import { API } from ".";
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
