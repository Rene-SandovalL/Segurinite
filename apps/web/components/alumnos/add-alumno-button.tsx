interface AddAlumnoButtonProps {
  onClick: () => void;
}

export function AddAlumnoButton({ onClick }: AddAlumnoButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full h-14 rounded-2xl bg-[#d0d1d6] hover:bg-[#c4c6cb] text-gray-600 text-4xl leading-none font-light transition-all"
      aria-label="Agregar nuevo alumno"
    >
      +
    </button>
  );
}
