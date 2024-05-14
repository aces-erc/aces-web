export type IEvent = {
  id: string;
  title: string;
  body: string;
  startDate: string;
  thumbnail: {
    url: string;
    publicId?: string;
  };
  slug: string;
};
