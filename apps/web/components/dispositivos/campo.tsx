interface CampoTextoProps {
  label: string;
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  tipo?: "text" | "number" | "password";
  disabled?: boolean;
}

export function CampoTexto({
  label,
  valor,
  onChange,
  placeholder,
  tipo = "text",
  disabled,
}: CampoTextoProps) {
  return (
    <div className="relative flex flex-col" style={{ paddingTop: 10 }}>
      <input
        type={tipo}
        value={valor}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-white text-[#3A3A3A] focus:outline-none disabled:opacity-50"
        style={{
          border: "1px solid #3A3A3A",
          borderRadius: 20,
          height: 52,
          paddingLeft: 22,
          paddingRight: 22,
          fontSize: 16,
        }}
      />

      <span
        className="absolute bg-white text-[#3A3A3A] pointer-events-none"
        style={{ top: 0, left: 16, fontSize: 14, lineHeight: "18px", paddingLeft: 4, paddingRight: 4 }}
      >
        {label}
      </span>
    </div>
  );
}

interface OpcionSelect {
  value: string;
  label: string;
}

interface CampoSelectProps {
  label: string;
  valor: string;
  onChange: (valor: string) => void;
  opciones: OpcionSelect[];
  placeholder?: string;
  disabled?: boolean;
}

export function CampoSelect({
  label,
  valor,
  onChange,
  opciones,
  placeholder = "Sin seleccionar",
  disabled,
}: CampoSelectProps) {
  return (
    <div className="relative flex flex-col" style={{ paddingTop: 10 }}>
      <select
        value={valor}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-white text-[#3A3A3A] focus:outline-none appearance-none cursor-pointer disabled:opacity-50"
        style={{
          border: "1px solid #3A3A3A",
          borderRadius: 20,
          height: 52,
          paddingLeft: 22,
          paddingRight: 36,
          fontSize: 16,
        }}
      >
        <option value="">{placeholder}</option>
        {opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>

      <span
        className="absolute bg-white text-[#3A3A3A] pointer-events-none"
        style={{ top: 0, left: 16, fontSize: 14, lineHeight: "18px", paddingLeft: 4, paddingRight: 4 }}
      >
        {label}
      </span>
    </div>
  );
}

interface BotonAccionProps {
  label: string;
  onClick: () => void;
  variant?: "primario" | "secundario";
  disabled?: boolean;
  type?: "button" | "submit";
}

export function BotonAccion({
  label,
  onClick,
  variant = "primario",
  disabled,
  type = "button",
}: BotonAccionProps) {
  const esPrimario = variant === "primario";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="font-normal border-none cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        height: 48,
        padding: "0 24px",
        borderRadius: 20,
        fontSize: 16,
        color: esPrimario ? "#FFFFFF" : "#3A3A3A",
        background: esPrimario ? "#575EAA" : "#D9D9D9",
        boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
      }}
    >
      {label}
    </button>
  );
}
