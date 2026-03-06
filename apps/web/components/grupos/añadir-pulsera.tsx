import Image from "next/image";
import { BotonAtras } from "@/components/ui/boton-atras";

interface TarjetaOpcionProps {
  titulo: string;
  colorCabecera: string;
  icono: string;
  onClick?: () => void;
}

/** Tarjeta grande de opción — cabecera de color + cuerpo blanco con icono */
function TarjetaOpcion({ titulo, colorCabecera, icono, onClick }: TarjetaOpcionProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col overflow-hidden rounded-[25px] bg-white border-none cursor-pointer focus:outline-none shrink-0"
      style={{
        width: "clamp(240px, 32vw, 436px)",
        height: "clamp(300px, 40vw, 543px)",
        boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
      }}
    >
      {/* Cabecera de color */}
      <div
        className="w-full shrink-0 flex items-center justify-center"
        style={{
          height: "clamp(72px, 9vw, 130px)",
          background: colorCabecera,
        }}
      >
        <span
          className="text-white font-normal text-center"
          style={{ fontSize: "clamp(16px, 2vw, 32px)" }}
        >
          {titulo}
        </span>
      </div>

      {/* Cuerpo blanco con icono */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Image
          src={icono}
          alt={titulo}
          width={280}
          height={280}
          className="object-contain max-w-full max-h-full"
          style={{ width: "clamp(130px, 18vw, 280px)", height: "auto" }}
        />
      </div>
    </button>
  );
}

interface AñadirPulseraProps {
  onNuevoRegistro?: () => void;
  onRegistroExistente?: () => void;
}

/**
 * Pantalla 1 del flujo de añadir pulsera.
 * Muestra dos opciones: "Registro existente" y "Nuevo registro".
 */
export function AñadirPulsera({ onNuevoRegistro, onRegistroExistente }: AñadirPulseraProps = {}) {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* ── Botón atrás ── */}
      <div className="shrink-0" style={{ padding: "28px 0 0 28px" }}>
        <BotonAtras />
      </div>

      {/* ── Subtítulo ── */}
      <p
        className="text-center font-normal shrink-0"
        style={{
          color: "#696969",
          fontSize: "clamp(18px, 2.2vw, 32px)",
          margin: "0 0 clamp(20px, 3vw, 48px)",
        }}
      >
        Añadir pulsera a partir de...
      </p>

      {/* ── Tarjetas de opción ── */}
      <div className="flex-1 flex items-center justify-center gap-[clamp(24px,5vw,69px)] px-8 pb-8">
        <TarjetaOpcion
          titulo="REGISTRO EXISTENTE"
          colorCabecera="#6AE89D"
          icono="/icons/registro_existente_icon.png"
          onClick={onRegistroExistente}
        />
        <TarjetaOpcion
          titulo="NUEVO REGISTRO"
          colorCabecera="#00BCD4"
          icono="/icons/nuevo_registro_icon.png"
          onClick={onNuevoRegistro}
        />
      </div>
    </div>
  );
}
