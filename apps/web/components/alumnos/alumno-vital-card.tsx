import { type ReactNode } from "react";

interface AlumnoVitalCardProps {
  title: string;
  subtitle?: string;
  borderColor: string;
  children: ReactNode;
}

export function AlumnoVitalCard({ title, subtitle, borderColor, children }: AlumnoVitalCardProps) {
  return (
    <div
      className="rounded-2xl bg-[#2e2e38] px-4 py-3 text-white"
      style={{ border: `3px solid ${borderColor}` }}
    >
      <h4 className="text-lg leading-none font-semibold text-center">{title}</h4>
      {subtitle ? (
        <p className="text-sm text-gray-300 leading-none text-center mt-1">{subtitle}</p>
      ) : null}
      <div className="mt-2.5">{children}</div>
    </div>
  );
}
