import type { GrupoMock } from "@/lib/mock/grupos";
import { COLOR_HEX } from "@/lib/mock/grupos";

interface GroupButtonProps {
  grupo: GrupoMock;
  selected: boolean;
  onClick: () => void;
}

/** Tarjeta de grupo en el sidebar — altura 115 px, esquinas redondeadas */
export default function GroupButton({ grupo, selected, onClick }: GroupButtonProps) {
  const color = COLOR_HEX[grupo.color];

  return (
    <button
      onClick={onClick}
      className="relative w-full h-28.75 rounded-[25px] overflow-hidden text-left cursor-pointer focus:outline-none"
      style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
    >
      {/* fondo blanco */}
      <div className="absolute inset-0 bg-white" />

      {/* franja lateral de color */}
      <div
        className="absolute left-0 top-0 h-full w-26.5"
        style={{ background: color }}
      />

      {/* letra "G" centrada en la franja */}
      <div className="absolute left-0 top-0 h-full w-26.5 flex items-center justify-center">
        <span className="text-white text-[32px] font-normal leading-none select-none">
          {grupo.iconText}
        </span>
      </div>

      {/* contenido derecho */}
      <div className="absolute left-28.25 right-4 top-0 h-full flex flex-col justify-center gap-0">
        {/* nombre */}
        <span className="text-[#3A3A3A] text-[20px] font-normal leading-tight text-center">
          {grupo.nombre}
        </span>

        {/* línea divisora */}
        <div className="w-full h-px bg-[#3A3A3A] my-1" />

        {/* burbujas de avatares */}
        <div className="flex gap-2 justify-center items-center">
          {Array.from({ length: grupo.bubbles }).map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full shrink-0"
              style={{ background: selected ? "#fff" : "#D9D9D9" }}
            />
          ))}
        </div>
      </div>

      {/* borde de selección */}
      {selected && (
        <div
          className="absolute inset-0 rounded-[25px] border-2 pointer-events-none"
          style={{ borderColor: color }}
        />
      )}
    </button>
  );
}
