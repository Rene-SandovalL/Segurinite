import Link from "next/link";

interface AlumnoBackButtonProps {
  href: string;
}

export function AlumnoBackButton({ href }: AlumnoBackButtonProps) {
  return (
    <Link
      href={href}
      aria-label="Regresar"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#e8e8ea] text-gray-600 hover:bg-[#dcdce0] transition-colors shadow-sm"
    >
      <span className="text-lg leading-none">←</span>
    </Link>
  );
}
