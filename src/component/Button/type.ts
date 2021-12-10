import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "outline" | "ghost" | "solid-blue" | "solid-red" | "solid-gray" | "solid-white" | "solid-black";

type ButtonType = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

export type { ButtonType, ButtonVariant };
