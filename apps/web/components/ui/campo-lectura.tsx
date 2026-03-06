interface CampoLecturaProps {
  etiqueta: string;
  valor: string;
  /** Número de columnas que ocupa en el grid padre (default 1) */
  span?: number;
}

/**
 * Campo de solo lectura.
 * Muestra etiqueta gris arriba y valor oscuro abajo.
 * Diseñado para usarse dentro de un CSS Grid de 10 columnas.
 */
export function CampoLectura({ etiqueta, valor, span = 1 }: CampoLecturaProps) {
  return (
    <div
      className="flex flex-col justify-center bg-white rounded-[20px] min-w-0 box-border"
      style={{
        gridColumn: `span ${span}`,
        padding: "6px 18px 10px",
        height: 60,
        gap: 2,
      }}
    >
      <span className="text-[13px] text-[#7A7A7A] leading-none">{etiqueta}</span>
      <span
        className="text-[18px] text-[#3A3A3A] leading-snug overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {valor}
      </span>
    </div>
  );
}
