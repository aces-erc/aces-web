import { Committee } from "@/schema/committee.zod";
import axios from "axios";
import { API } from ".";

/**
 * Adds a new committee member.
 * @param newCommitteeMember The new committee member to be added.
 * @returns A Promise that resolves to a string indicating the success message or rejects with an error message.
 */
export const addCommitteeMember = async (
  newCommitteeMember: Committee
): Promise<string> => {
  return new Promise((resolve, reject) => {
    axios
      .post(API.committee, newCommitteeMember, {
        withCredentials: true,
      })
      .then((res) => {
        resolve(res.data?.message ?? "Committee member added successfully");
      })
      .catch((error) => {
        reject(error?.response?.data?.message ?? "Something went wrong");
      });
  });
};

/**
 * Retrieves all committee members from the API.
 * @returns A Promise that resolves to an array of Committee objects.
 */
export const getAllCommitteeMembers = async (): Promise<Committee[]> => {
  return new Promise((resolve, reject) => {
    axios
      .get(API.committee, {
        withCredentials: true,
      })
      .then((res) => {
        resolve(res.data?.data);
      })
      .catch((error) => {
        reject(error?.response?.data?.message ?? "Something went wrong");
      });
  });
};

/**
 * Deletes a committee member with the specified ID.
 * @param id - The ID of the committee member to delete.
 * @returns A Promise that resolves with the response data if successful, or rejects with an error message if an error occurs.
 */
export const deleteCommitteeMember = async (id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(API.committee, {
        data: { id },
        withCredentials: true,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error?.response?.data?.message ?? "Something went wrong");
      });
  });
};
