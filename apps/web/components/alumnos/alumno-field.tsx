import type { CSSProperties } from "react";

interface AlumnoFieldProps {
  label: string;
  value: string;
  className?: string;
  multiline?: boolean;
  style?: CSSProperties;
}

export function AlumnoField({ label, value, className = "", multiline = false, style }: AlumnoFieldProps) {
  return (
    <div
      className={`rounded-xl bg-white px-4 py-2.5 min-h-13 w-full max-w-full overflow-hidden ${className}`}
      style={style}
    >
      <p className="text-[10px] text-gray-400 leading-none mb-1">{label}</p>
      <p
        className={`text-[15px] leading-snug text-gray-700 font-medium max-w-full ${
          multiline ? "whitespace-normal wrap-break-word" : "whitespace-nowrap truncate"
        }`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}
