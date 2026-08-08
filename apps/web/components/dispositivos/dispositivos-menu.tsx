interface TarjetaDispositivoProps {
  titulo: string;
  color: string;
  icono: React.ReactNode;
  onClick: () => void;
}

function TarjetaDispositivo({ titulo, color, icono, onClick }: TarjetaDispositivoProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-6 rounded-[25px] border-none cursor-pointer focus:outline-none shrink-0"
      style={{
        width: "clamp(240px, 30vw, 400px)",
        height: "clamp(240px, 30vw, 400px)",
        background: color,
        boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
      }}
    >
      {icono}
      <span className="text-white font-normal" style={{ fontSize: "clamp(24px, 2.6vw, 40px)" }}>
        {titulo}
      </span>
    </button>
  );
}

/** Ícono de pulsera (smartwatch) */
function IconoPulsera() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <rect x="12" y="8" width="12" height="16" rx="4" stroke="white" strokeWidth="3" />
      <rect x="12" y="72" width="12" height="16" rx="4" stroke="white" strokeWidth="3" />
      <rect x="24" y="26" width="48" height="44" rx="12" stroke="white" strokeWidth="3.5" />
      <circle cx="48" cy="48" r="12" stroke="white" strokeWidth="3" />
      <path d="M48 40V48L53 53" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Ícono de beacon (señal/baliza) */
function IconoBeacon() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <circle cx="48" cy="48" r="6" fill="white" />
      <path d="M34 62C24 52 24 40 34 30" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M62 62C72 52 72 40 62 30" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M22 74C6 58 6 34 22 18" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M74 74C90 58 90 34 74 18" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

interface DispositivosMenuProps {
  onSeleccionarPulseras: () => void;
  onSeleccionarBeacons: () => void;
}

/** Menú de selección: Pulseras (verde) o Beacons (morado) */
export function DispositivosMenu({
  onSeleccionarPulseras,
  onSeleccionarBeacons,
}: DispositivosMenuProps) {
  return (
    <div className="h-full w-full flex items-center justify-center gap-[clamp(24px,5vw,64px)] px-8">
      <TarjetaDispositivo
        titulo="Pulseras"
        color="#3CB878"
        icono={<IconoPulsera />}
        onClick={onSeleccionarPulseras}
      />
      <TarjetaDispositivo
        titulo="Beacons"
        color="#8E24AA"
        icono={<IconoBeacon />}
        onClick={onSeleccionarBeacons}
      />
    </div>
  );
}
