import axios from "axios";
import { API } from ".";

/**
 * Uploads an image to the server.
 * @param image - The image file to upload.
 * @param folder - The folder where the image should be stored.
 * @returns A promise that resolves to an object containing the URL and public ID of the uploaded image.
 */
export const uploadImage = (image: File, folder: string) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("folder", folder);
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

/**
 * Deletes an image from the server.
 * @param publicId - The public ID of the image to be deleted.
 * @returns A promise that resolves with the deleted image data, or rejects with an error.
 */
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
