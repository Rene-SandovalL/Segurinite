interface InputProps {
  label: string;
  value: string;
}

export function Input({ label, value }: InputProps) {
  return (
    <div className="rounded-2xl bg-[#f4f4f5] px-4 py-2.5 min-h-[62px]">
      <p className="text-xs text-gray-400 leading-none mb-1">{label}</p>
      <p className="text-2xl leading-none text-gray-600 font-medium">{value}</p>
    </div>
  );
}
