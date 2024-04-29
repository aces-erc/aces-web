import { useEffect, useState } from "react";

/**
 * A hook that returns the height and width of the window
 * @returns {height: number, width: number} - The height and width of the window
 */
export const useInnerSize = () => {
  const [size, setSize] = useState({
    height: window?.innerHeight || 1000,
    width: window?.innerWidth || 1000, // i gave the max values so that it does not show not supported page for a instance when the window is not loaded
  });
  useEffect(() => {
    window.addEventListener("resize", () => {
      setSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    });
    return () => {
      window.removeEventListener("resize", () => {
        setSize({
          height: window.innerHeight,
          width: window.innerWidth,
        });
      });
    };
  }, []);
  return size;
};
