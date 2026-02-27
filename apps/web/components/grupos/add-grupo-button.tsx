interface AddGrupoButtonProps {
  onClick: () => void;
}

export function AddGrupoButton({ onClick }: AddGrupoButtonProps) {
  return (
    <button
      onClick={onClick}
      className="mt-1 w-full h-13 rounded-2xl bg-[#d3d4d8] hover:bg-[#c8cacf] text-gray-600 text-4xl leading-none font-light transition-colors"
      aria-label="Agregar nuevo grupo"
    >
      +
    </button>
  );
}
