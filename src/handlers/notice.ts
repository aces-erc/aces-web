import { NewBlog } from "@/schema/blog.zod";
import axios from "axios";
import { API } from ".";
import { INotice } from "@/types/notice.types";
import { NewNotice } from "@/schema/notice.zod";

/**
 * Retrieves a list of notices from the API.
 * @returns A Promise that resolves to an array of INotice objects.
 */
export const getNotices = async (): Promise<INotice[]> => {
  return new Promise((resolve, reject) => {
    axios
      .get(API.notices, {
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
 * @param newNotice - The new blog object to be created.
 * @returns A promise that resolves to the created blog data.
 */
export const createNotice = async (newNotice: NewNotice) => {
  return new Promise((resolve, reject) => {
    axios
      .post(API.notices, newNotice, {
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
export const deleteNoticeById = async (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    axios
      .delete(API.notices, {
        data: { id },
        withCredentials: true,
      })
      .then((res) => {
        resolve(res.data?.message ?? "Notice deleted successfully!");
      })
      .catch((error) => {
        reject(error?.response?.data?.message ?? "Something went wrong!");
      });
  });
};
