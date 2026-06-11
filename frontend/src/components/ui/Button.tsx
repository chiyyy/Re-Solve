import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success" | "ghostDark";
  size?: "sm" | "md" | "lg" | "icon";
}

export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-1.5 font-medium transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    secondary: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
    danger: "border border-red-100 bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "bg-transparent text-gray-500 hover:text-gray-900",
    ghostDark: "bg-transparent text-gray-400 hover:text-indigo-600 hover:bg-indigo-50",
    success: "bg-green-50 text-green-700",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-4 py-2.5 text-sm w-full",
    icon: "p-1.5",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
