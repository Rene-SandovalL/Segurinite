interface InfoFieldProps {
  label: string;
  value: string;
}

export function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div className="rounded-[18px] bg-[#f3f3f4] px-4 py-3 min-h-21.5 cursor-default select-none flex flex-col justify-center gap-1">
      <p className="pl-3 text-[15px] text-gray-400 leading-none mb-1">{label}</p>
      <p className="pl-3 text-[20px] leading-none text-gray-600 font-medium truncate">{value}</p>
    </div>
  );
}
