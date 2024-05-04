import { NewBlog } from "@/schema/blog.zod";
import axios from "axios";
import { API } from ".";
import { IBlog } from "@/types/blog.types";

/**
 * Retrieves a list of blogs from the API.
 * @returns A Promise that resolves to an array of IBlog objects.
 */
export const getBlogs = async (): Promise<IBlog[]> => {
  return new Promise((resolve, reject) => {
    axios
      .get(API.blogs, {
        withCredentials: true,
      })
      .then((res) => {
        resolve(res.data?.data);
      })
      .catch((error) => {
        reject(error?.response?.data?.message ?? "Something went wrong!");
      });
  });
};

/**
 * Creates a new blog.
 * @param newBlog - The new blog object to be created.
 * @returns A promise that resolves to the created blog data.
 */
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
        reject(error?.response?.data?.message ?? "Something went wrong!");
      });
  });
};

/**
 * Deletes a blog by its ID.
 * @param id - The ID of the blog to delete.
 * @returns A Promise that resolves to a string indicating the result of the deletion.
 */
export const deleteBlogById = async (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    axios
      .delete(API.blogs, {
        data: { id },
        withCredentials: true,
      })
      .then((res) => {
        resolve(res.data?.message ?? "Blog deleted successfully!");
      })
      .catch((error) => {
        reject(error?.response?.data?.message ?? "Something went wrong!");
      });
  });
};
