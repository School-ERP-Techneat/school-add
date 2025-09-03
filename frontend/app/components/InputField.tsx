"use client";

import { FieldError } from "react-hook-form";
import { motion } from "framer-motion";
import type { InputHTMLAttributes } from "react";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
}: InputFieldProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-2 w-full md:w-1/4"
    >
      <label className="text-xs text-gray-500 dark:text-gray-400">{label}</label>
      <input
        type={type}
        {...register(name)}
        defaultValue={defaultValue}
        {...inputProps}
        className={`p-2 rounded-md text-sm w-full transition ring-[1.5px] focus:ring-2 focus:ring-lamaSky dark:bg-gray-900 dark:text-white dark:ring-gray-700 ${
          error ? "ring-red-400" : "ring-gray-300"
        }`}
      />
      {error?.message && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs text-red-400"
        >
          {error.message.toString()}
        </motion.p>
      )}
    </motion.div>
  );
};

export default InputField;
