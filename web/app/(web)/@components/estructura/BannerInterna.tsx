"use client";
import { useEffect } from "react";

export const BannerInterna = ({
  title,
  banner,
}: {
  title: string;
  banner: string;
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section
      style={{ backgroundImage: `url(${banner})` }}
      className="relative z-10 flex items-center justify-center px-5 py-12 pt-40 bg-center bg-no-repeat bg-cover lg:px-20 md:py-32 lg:py-24 lg:pt-44 before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-primary-950 before:opacity-60 before:-z-10"
    >
      <h1 className="text-3xl font-extrabold text-center uppercase font_kanit md:text-4xl text-white-main ">
        {title}
      </h1>
    </section>
  );
};
