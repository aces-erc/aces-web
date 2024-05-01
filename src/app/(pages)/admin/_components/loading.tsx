import { MoonLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <MoonLoader size={24} color="#1c22d6" />
    </div>
  );
};
export default Loading;
