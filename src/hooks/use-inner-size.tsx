import { useEffect, useState } from "react";

/**
 * A hook that returns the height and width of the window
 * @returns {height: number, width: number} - The height and width of the window
 */
export const useInnerSize = () => {
  const [size, setSize] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
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
