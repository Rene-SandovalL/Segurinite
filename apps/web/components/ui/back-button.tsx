import Link from "next/link";

interface BackButtonProps {
  href: string;
}

export function BackButton({ href }: BackButtonProps) {
  return (
    <Link
      href={href}
      aria-label="Regresar"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e4e5e8] text-gray-700 shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
    >
      <span className="text-2xl leading-none">←</span>
    </Link>
  );
}
