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
