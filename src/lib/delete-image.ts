import cloudinary from "./cloudinary";

export const DeleteImage = async (publicId: string) => {
  return new Promise(async (resolve, reject) => {
    await cloudinary.uploader.destroy(publicId, async (err, result) => {
      if (err) {
        return reject(err.message);
      } else {
        return resolve(result);
      }
    });
  });
};
