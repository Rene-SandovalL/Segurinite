import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-1 text-sm text-gray-600">{children}</span>;
}
