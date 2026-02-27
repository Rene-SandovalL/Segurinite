import { type ReactNode } from "react";

interface VitalsCardProps {
  title: string;
  subtitle?: string;
  borderColor: string;
  children: ReactNode;
}

export function VitalsCard({ title, subtitle, borderColor, children }: VitalsCardProps) {
  return (
    <div
      className="rounded-[22px] bg-[#3a3a4a] p-4 text-white"
      style={{ border: `4px solid ${borderColor}` }}
    >
      <h4 className="text-[46px] leading-none font-normal text-center">{title}</h4>
      {subtitle ? (
        <p className="text-[36px] text-gray-200 leading-none text-center mt-1">{subtitle}</p>
      ) : null}
      <div className="mt-3">{children}</div>
    </div>
  );
}
