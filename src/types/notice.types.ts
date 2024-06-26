export type INotice = {
  id: string;
  title: string;
  body: string;
  thumbnail: {
    url: string;
    publicId?: string;
  };
  images?: {
    url: string;
    publicId?: string;
  }[];
  createdAt: string;
  updatedAt: string;
  slug: string;
};
