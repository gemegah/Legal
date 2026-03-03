import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "accent" | "ghost" | "subtle";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const sizeClassMap: Record<ButtonSize, string> = {
  sm: "ui-button-sm",
  md: "ui-button-md",
  lg: "ui-button-lg",
};

export function Button({
  children,
  className,
  disabled,
  loading = false,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      className={cn("btn", `btn-${variant}`, sizeClassMap[size], className)}
      disabled={isDisabled}
      type={type}
    >
      {loading ? "Working..." : children}
    </button>
  );
}
