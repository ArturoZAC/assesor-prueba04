"use client";
import { LoaderSubmit } from "@/components/form/LoaderSubmit";
import React from "react";

export const ButtonSubmit = ({
  loading,
  text,
  disabled,
}: {
  loading: boolean;
  text: string;
  disabled?: boolean;
}) => {
  return (
    <button
      type={loading ? "button" : "submit"}
      disabled={disabled}
      className={`flex justify-center w-full py-3 text-center transition-all duration-200 rounded-main text-white-main bg-secondary-main hover:bg-primary-main ${
        disabled ? "opacity-80 hover:!bg-secondary-main" : "opacity-100"
      }`}
    >
      {loading ? <LoaderSubmit /> : text}
    </button>
  );
};
