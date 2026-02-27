interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-10 h-10 text-sm",
  md: "w-16 h-16 text-xl",
  lg: "w-28 h-28 text-4xl",
};

export function Avatar({ initials, size = "md" }: AvatarProps) {
  return (
    <div className={`${sizeMap[size]} rounded-full bg-[#5c5ca8] text-white flex items-center justify-center font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.15)]`}>
      {initials}
    </div>
  );
}
