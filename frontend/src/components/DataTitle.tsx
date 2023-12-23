"use client";

import { useWindowSize } from "usehooks-ts";

interface DataTitleProps {
  title: string;
}

export function DataTitle({ title }: DataTitleProps) {
  const { width } = useWindowSize();

  const truncate = (str: string, len = 12) => {
    return str.length > len ? `${str.substring(0, len)}...` : str;
  };

  return (
    <h1
      className={`mb-3 ${
        !title.includes(" ") ? "break-all" : "break-words"
      } font-sans text-3xl font-extrabold md:text-6xl`}
    >
      {width <= 768 || width >= 920 ? title : truncate(title)}
    </h1>
  );
}
