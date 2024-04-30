import { cn } from "@/utils/cn";
import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

const FormErrorLine = ({ children, className, ...props }: Props) => {
  return (
    <div className={cn("text-sm text-red-500", className)} {...props}>
      {children}
    </div>
  );
};
export default FormErrorLine;
