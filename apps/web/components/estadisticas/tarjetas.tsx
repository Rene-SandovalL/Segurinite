"use client";

/**
 * Primitivas visuales de la pantalla de Estadísticas.
 *
 * - TarjetaGrafico: contenedor claro (mismo lenguaje que las tarjetas
 *   agrupadas de Configuración) para cada gráfico.
 * - TarjetaKpi: card oscura con acento de marca, el patrón documentado en
 *   .claude/rules/frontend.md para números destacados.
 */

interface TarjetaGraficoProps {
  titulo: string;
  /** Qué pregunta responde el gráfico — nunca dejar un gráfico sin contexto. */
  descripcion: string;
  /** Si es true se muestra el estado vacío en vez de children. */
  vacio?: boolean;
  mensajeVacio?: string;
  /** Alto del área del gráfico. */
  alto?: number;
  children: React.ReactNode;
}

export function TarjetaGrafico({
  titulo,
  descripcion,
  vacio = false,
  mensajeVacio = "Sin datos en este rango",
  alto = 260,
  children,
}: TarjetaGraficoProps) {
  return (
    <div
      className="flex flex-col"
      style={{
        background: "var(--color-card-agrupada)",
        border: "1px solid var(--color-borde)",
        borderRadius: 25,
        padding: "clamp(16px, 2vw, 24px)",
      }}
    >
      <span className="text-[#3A3A3A] font-normal" style={{ fontSize: 18 }}>
        {titulo}
      </span>
      <span className="text-[#8A8A8A]" style={{ fontSize: 13, marginBottom: 12 }}>
        {descripcion}
      </span>

      <div style={{ height: alto }}>
        {vacio ? (
          <div className="h-full flex flex-col items-center justify-center" style={{ gap: 6 }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 3v18h18M7 15l3-4 3 3 4-6"
                stroke="#B9B9C0"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[#8A8A8A]" style={{ fontSize: 14 }}>
              {mensajeVacio}
            </span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

interface TarjetaKpiProps {
  etiqueta: string;
  valor: string;
  detalle?: string;
}

export function TarjetaKpi({ etiqueta, valor, detalle }: TarjetaKpiProps) {
  return (
    <div
      className="flex flex-col justify-center"
      style={{
        background: "#3A3A3A",
        border: "2px solid #575EAA",
        borderRadius: 22,
        padding: "18px 22px",
        minHeight: 108,
      }}
    >
      <span className="text-[#B9B9C0]" style={{ fontSize: 13 }}>
        {etiqueta}
      </span>
      <span className="text-white font-normal" style={{ fontSize: 30, lineHeight: 1.2 }}>
        {valor}
      </span>
      {detalle && (
        <span className="text-[#8A8A8A]" style={{ fontSize: 12 }}>
          {detalle}
        </span>
      )}
    </div>
  );
}

interface TituloSeccionProps {
  titulo: string;
}

export function TituloSeccion({ titulo }: TituloSeccionProps) {
  return (
    <div className="flex flex-col" style={{ gap: 6, marginTop: 8 }}>
      <span
        className="text-[#3A3A3A] font-normal"
        style={{ fontSize: "clamp(20px, 2.2vw, 26px)" }}
      >
        {titulo}
      </span>
      <div style={{ height: 1, background: "var(--color-borde)" }} />
    </div>
  );
}

/** Lista horizontal tipo ranking — más legible que un gráfico para top-10. */
interface FilaRankingProps {
  posicion: number;
  nombre: string;
  subtitulo: string | null;
  valor: string;
  /** 0–1, ancho de la barra de fondo relativo al máximo del ranking. */
  proporcion: number;
  color: string;
}

export function FilaRanking({
  posicion,
  nombre,
  subtitulo,
  valor,
  proporcion,
  color,
}: FilaRankingProps) {
  return (
    <div className="relative flex items-center" style={{ gap: 12, padding: "8px 12px" }}>
      <div
        className="absolute inset-y-0 left-0 pointer-events-none"
        style={{
          width: `${Math.max(4, proporcion * 100)}%`,
          background: color,
          opacity: 0.16,
          borderRadius: 12,
        }}
      />

      <span className="relative text-[#8A8A8A] shrink-0" style={{ fontSize: 13, width: 20 }}>
        {posicion}
      </span>
      <div className="relative flex-1 min-w-0 flex flex-col">
        <span className="text-[#3A3A3A] truncate" style={{ fontSize: 15 }}>
          {nombre}
        </span>
        {subtitulo && (
          <span className="text-[#8A8A8A] truncate" style={{ fontSize: 12 }}>
            {subtitulo}
          </span>
        )}
      </div>
      <span className="relative text-[#3A3A3A] font-normal shrink-0" style={{ fontSize: 16 }}>
        {valor}
      </span>
    </div>
  );
}
