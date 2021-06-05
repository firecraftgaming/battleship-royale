import React from "react";

export const MainLayout: React.FC = ({ children }) => {
  return (
    <div
      className="flex flex-col justify-center items-center w-full h-full"
    >
      {children}
    </div>
  );
};