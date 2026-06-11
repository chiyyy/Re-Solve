import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300 transition-colors text-sm ${className}`}
      {...props}
    />
  );
}
