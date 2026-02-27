import Link from "next/link";

interface AddAlumnoButtonProps {
  href: string;
}

export function AddAlumnoButton({ href }: AddAlumnoButtonProps) {
  return (
    <Link
      href={href}
      className="w-full h-14 rounded-2xl bg-[#d0d1d6] hover:bg-[#c4c6cb] text-gray-600 text-4xl leading-none font-light transition-all flex items-center justify-center"
      aria-label="Agregar nuevo alumno"
    >
      +
    </Link>
  );
}
