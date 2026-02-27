import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return <div className={`rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] ${className}`}>{children}</div>;
}
