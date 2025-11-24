import React, { ReactNode } from "react";

interface ContentMainInterface {
  className?: string;
  children?: ReactNode;
}

export const ContentMain = ({ children, className }: ContentMainInterface) => {
  return (
    <div
      className={`max-w-[1440px] overflow-x-clip mx-auto w-full px-4 md:px-6 lg:px-8 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
};
