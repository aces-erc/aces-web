import { Committee } from "@/schema/committee.zod";
import axios from "axios";
import { API } from ".";

export const addCommitteeMember = async (newCommitteeMember: Committee) => {
  return new Promise((resolve, reject) => {
    axios
      .post(API.committee, newCommitteeMember, {
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
        reject(error);
      });
  });
};

export const getCommitteeMember = async (id: string): Promise<Committee> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API.committee}${id ? `/?id=${id}` : ""}`, {
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
        reject(error);
      });
  });
};
