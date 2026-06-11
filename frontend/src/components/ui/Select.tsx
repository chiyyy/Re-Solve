import type { SelectHTMLAttributes } from "react";

export function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-900 outline-none focus:border-gray-300 transition-colors text-sm cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
