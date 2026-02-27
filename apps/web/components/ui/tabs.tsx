import { type ReactNode } from "react";

interface TabsProps {
  children: ReactNode;
}

export function Tabs({ children }: TabsProps) {
  return <div className="flex items-end gap-0.5">{children}</div>;
}
