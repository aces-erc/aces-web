import axios from "axios";
import { API } from ".";

export const uploadImage = (image: File) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("image", image);
    axios
      .post(API.image, formData)
      .then((res) => {
        const data = res.data?.data;
        resolve({
          url: data.url,
          publicId: data.public_id,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteImage = (publicId: string) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(API.image, {
        data: {
          publicId,
        },
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
