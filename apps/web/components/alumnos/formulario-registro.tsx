"use client";

import { useEffect, useMemo, useState } from "react";
import type { CreateAlumnoPayload } from "@/lib/api/segurinite";

type TipoSangreFormulario = CreateAlumnoPayload["tipoSangre"] | "";
type ParentescoFormulario = "" | "madre" | "padre" | "hermano" | "otros";

export interface FormularioRegistroInitialValues {
  nombre?: string;
  apellido?: string;
  fechaNacimiento?: string;
  tipoSangre?: TipoSangreFormulario;
  tutor1Nombre?: string;
  tutor1Telefono?: string;
  tutor1Parentesco?: ParentescoFormulario;
  tutor1Direccion?: string;
  tutor2Nombre?: string;
  tutor2Telefono?: string;
  tutor2Parentesco?: ParentescoFormulario;
  tutor2Direccion?: string;
  emergenciaNombre?: string;
  emergenciaTelefono?: string;
  emergenciaParentesco?: ParentescoFormulario;
  emergenciaDireccion?: string;
  emergenciaFechaNacimiento?: string;
}

interface CampoTextoProps {
  label: string;
  valor: string;
  onChange: (valor: string) => void;
  maxLength?: number;
  tipo?: "text" | "date";
}

function CampoTexto({
  label,
  valor,
  onChange,
  maxLength,
  tipo = "text",
}: CampoTextoProps) {
  const mostrarContador = typeof maxLength === "number" && tipo === "text";
  const contadorActual = String(valor.length).padStart(2, "0");

  return (
    <div
      className="relative flex flex-col"
      style={{
        paddingTop: 10,
        paddingBottom: mostrarContador ? 24 : 0,
      }}
    >
      <input
        type={tipo}
        value={valor}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        className="w-full bg-white text-[#3A3A3A] focus:outline-none"
        style={{
          border: "1px solid #3A3A3A",
          borderRadius: 25,
          height: 64,
          paddingLeft: 28,
          paddingRight: 28,
          fontSize: 18,
        }}
      />

      <span
        className="absolute bg-white text-[#3A3A3A] pointer-events-none"
        style={{
          top: 0,
          left: 20,
          fontSize: 18,
          lineHeight: "20px",
          paddingLeft: 4,
          paddingRight: 4,
        }}
      >
        {label}
      </span>

      {mostrarContador && (
        <span
          className="absolute text-[#5F5F5F]"
          style={{
            right: 2,
            bottom: 0,
            fontSize: "clamp(14px, 1vw, 20px)",
            lineHeight: 1,
          }}
        >
          {contadorActual} / {maxLength}
        </span>
      )}
    </div>
  );
}

interface SelectorSangreProps {
  valor: TipoSangreFormulario;
  onChange: (valor: TipoSangreFormulario) => void;
}

function SelectorSangre({ valor, onChange }: SelectorSangreProps) {
  return (
    <div className="relative flex flex-col" style={{ paddingTop: 10 }}>
      <select
        value={valor}
        onChange={(event) => onChange(event.target.value as TipoSangreFormulario)}
        className="w-full bg-white text-[#3A3A3A] focus:outline-none appearance-none cursor-pointer"
        style={{
          border: "1px solid #3A3A3A",
          borderRadius: 25,
          height: 64,
          paddingLeft: 28,
          paddingRight: 40,
          fontSize: 18,
        }}
      >
        <option value="">Sin especificar</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
      </select>

      <span
        className="absolute bg-white text-[#3A3A3A] pointer-events-none"
        style={{
          top: 0,
          left: 20,
          fontSize: 18,
          lineHeight: "20px",
          paddingLeft: 4,
          paddingRight: 4,
        }}
      >
        Tipo de sangre
      </span>
    </div>
  );
}

interface SelectorParentescoProps {
  valor: ParentescoFormulario;
  onChange: (valor: ParentescoFormulario) => void;
}

function SelectorParentesco({ valor, onChange }: SelectorParentescoProps) {
  return (
    <div className="relative flex flex-col" style={{ paddingTop: 10 }}>
      <select
        value={valor}
        onChange={(event) => onChange(event.target.value as ParentescoFormulario)}
        className="w-full bg-white text-[#3A3A3A] focus:outline-none appearance-none cursor-pointer"
        style={{
          border: "1px solid #3A3A3A",
          borderRadius: 25,
          height: 64,
          paddingLeft: 28,
          paddingRight: 40,
          fontSize: 18,
        }}
      >
        <option value="">Selecciona parentesco</option>
        <option value="madre">Madre</option>
        <option value="padre">Padre</option>
        <option value="hermano">Hermano</option>
        <option value="otros">Otros</option>
      </select>

      <span
        className="absolute bg-white text-[#3A3A3A] pointer-events-none"
        style={{
          top: 0,
          left: 20,
          fontSize: 18,
          lineHeight: "20px",
          paddingLeft: 4,
          paddingRight: 4,
        }}
      >
        Parentesco
      </span>
    </div>
  );
}

function EncabezadoSeccion({ titulo }: { titulo: string }) {
  return (
    <div className="flex flex-col gap-1" style={{ marginTop: 26, marginBottom: 16 }}>
      <span className="text-[#3A3A3A] font-normal" style={{ fontSize: 20 }}>
        {titulo}
      </span>
      <div style={{ height: 1, background: "#3A3A3A" }} />
    </div>
  );
}

interface FormularioRegistroProps {
  onVolver: () => void;
  onRegistrar: (payload: Omit<CreateAlumnoPayload, "pulseraId">) => Promise<void> | void;
  registrando?: boolean;
  modo?: "registro" | "edicion";
  initialValues?: FormularioRegistroInitialValues;
}

export function FormularioRegistro({
  onVolver,
  onRegistrar,
  registrando = false,
  modo = "registro",
  initialValues,
}: FormularioRegistroProps) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [tipoSangre, setTipoSangre] = useState<TipoSangreFormulario>("");

  const [tutor1Nombre, setTutor1Nombre] = useState("");
  const [tutor1Telefono, setTutor1Telefono] = useState("");
  const [tutor1Parentesco, setTutor1Parentesco] = useState<ParentescoFormulario>("");
  const [tutor1Direccion, setTutor1Direccion] = useState("");

  const [tutor2Nombre, setTutor2Nombre] = useState("");
  const [tutor2Telefono, setTutor2Telefono] = useState("");
  const [tutor2Parentesco, setTutor2Parentesco] = useState<ParentescoFormulario>("");
  const [tutor2Direccion, setTutor2Direccion] = useState("");

  const [emergenciaNombre, setEmergenciaNombre] = useState("");
  const [emergenciaTelefono, setEmergenciaTelefono] = useState("");
  const [emergenciaParentesco, setEmergenciaParentesco] = useState<ParentescoFormulario>("");
  const [emergenciaDireccion, setEmergenciaDireccion] = useState("");
  const [emergenciaFechaNacimiento, setEmergenciaFechaNacimiento] = useState("");

  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const aplicarValoresIniciales = (values?: FormularioRegistroInitialValues) => {
    setNombre(values?.nombre ?? "");
    setApellido(values?.apellido ?? "");
    setFechaNacimiento(values?.fechaNacimiento ?? "");
    setTipoSangre(values?.tipoSangre ?? "");
    setTutor1Nombre(values?.tutor1Nombre ?? "");
    setTutor1Telefono(values?.tutor1Telefono ?? "");
    setTutor1Parentesco(values?.tutor1Parentesco ?? "");
    setTutor1Direccion(values?.tutor1Direccion ?? "");
    setTutor2Nombre(values?.tutor2Nombre ?? "");
    setTutor2Telefono(values?.tutor2Telefono ?? "");
    setTutor2Parentesco(values?.tutor2Parentesco ?? "");
    setTutor2Direccion(values?.tutor2Direccion ?? "");
    setEmergenciaNombre(values?.emergenciaNombre ?? "");
    setEmergenciaTelefono(values?.emergenciaTelefono ?? "");
    setEmergenciaParentesco(values?.emergenciaParentesco ?? "");
    setEmergenciaDireccion(values?.emergenciaDireccion ?? "");
    setEmergenciaFechaNacimiento(values?.emergenciaFechaNacimiento ?? "");
  };

  useEffect(() => {
    aplicarValoresIniciales(initialValues);
    setMensajeError(null);
  }, [initialValues]);

  const telefonosInvalidos = useMemo(() => {
    const patron = /^\d{10}$/;
    const telefonos = [tutor1Telefono, tutor2Telefono, emergenciaTelefono]
      .map((telefono) => telefono.trim())
      .filter((telefono) => telefono.length > 0);

    return telefonos.some((telefono) => !patron.test(telefono));
  }, [emergenciaTelefono, tutor1Telefono, tutor2Telefono]);

  const limpiarFormulario = () => {
    aplicarValoresIniciales(initialValues);
  };

  const handleSubmit = async () => {
    setMensajeError(null);

    if (!nombre.trim() || !apellido.trim()) {
      setMensajeError("Nombre y apellido del alumno son obligatorios.");
      return;
    }

    if (telefonosInvalidos) {
      setMensajeError("Los teléfonos deben contener exactamente 10 dígitos.");
      return;
    }

    const tutores: CreateAlumnoPayload["tutores"] = [
      {
        nombre: tutor1Nombre.trim(),
        telefono: tutor1Telefono.trim(),
        parentesco: tutor1Parentesco || undefined,
        direccion: tutor1Direccion.trim() || undefined,
      },
      {
        nombre: tutor2Nombre.trim(),
        telefono: tutor2Telefono.trim(),
        parentesco: tutor2Parentesco || undefined,
        direccion: tutor2Direccion.trim() || undefined,
      },
    ].filter((tutor) => tutor.nombre && tutor.telefono);

    if (!tutores.length) {
      setMensajeError("Debes registrar al menos un tutor con nombre y teléfono.");
      return;
    }

    const contactosEmergencia: CreateAlumnoPayload["contactosEmergencia"] = [
      {
        nombre: emergenciaNombre.trim(),
        telefono: emergenciaTelefono.trim(),
        parentesco: emergenciaParentesco || undefined,
        direccion: emergenciaDireccion.trim() || undefined,
        fechaNacimiento: emergenciaFechaNacimiento || undefined,
      },
    ].filter((contacto) => contacto.nombre && contacto.telefono);

    const payload: Omit<CreateAlumnoPayload, "pulseraId"> = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      fechaNacimiento: fechaNacimiento || undefined,
      tipoSangre: tipoSangre || undefined,
      tutores,
      contactosEmergencia,
    };

    try {
      await onRegistrar(payload);
      if (modo === "registro") {
        limpiarFormulario();
      }
    } catch (error) {
      if (error instanceof Error) {
        setMensajeError(error.message);
        return;
      }

      setMensajeError("No se pudo registrar el alumno.");
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div
        className="shrink-0 relative flex items-center justify-center"
        style={{ padding: "28px 28px 20px" }}
      >
        <button
          onClick={onVolver}
          className="absolute left-7 top-1/2 -translate-y-1/2 rounded-full bg-white border-none cursor-pointer flex items-center justify-center focus:outline-none"
          style={{ width: 44, height: 44, boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
          aria-label="Volver"
          type="button"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L3 12L9 6L10.4 7.4L6.8 11H19V7H21V13H6.8L10.4 16.6L9 18Z" fill="#1D1B20" />
          </svg>
        </button>

        <span className="text-[#3A3A3A] font-normal" style={{ fontSize: "clamp(20px, 2.2vw, 32px)" }}>
          {modo === "edicion" ? "ACTUALIZAR INFORMACIÓN" : "REGISTRAR INFORMACIÓN"}
        </span>
      </div>

      <div
        className="flex-1 overflow-y-scroll formulario-registro-scrollbar"
        style={{ padding: "0 clamp(20px, 3vw, 48px)", scrollbarGutter: "stable" }}
      >
        <EncabezadoSeccion titulo="Datos personales" />

        <div style={{ display: "grid", gridTemplateColumns: "5fr 6fr", gap: 20 }}>
          <CampoTexto label="Nombre(s)" valor={nombre} onChange={setNombre} maxLength={60} />
          <CampoTexto label="Apellido(s)" valor={apellido} onChange={setApellido} maxLength={60} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr", gap: 20, marginTop: 20 }}>
          <CampoTexto label="Fecha de nacimiento" valor={fechaNacimiento} onChange={setFechaNacimiento} tipo="date" />
          <SelectorSangre valor={tipoSangre} onChange={setTipoSangre} />
        </div>

        <EncabezadoSeccion titulo="Datos del tutor (1)" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <CampoTexto label="Nombre completo" valor={tutor1Nombre} onChange={setTutor1Nombre} maxLength={120} />
          <CampoTexto label="Num. Tel" valor={tutor1Telefono} onChange={setTutor1Telefono} maxLength={10} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
          <SelectorParentesco valor={tutor1Parentesco} onChange={setTutor1Parentesco} />
          <CampoTexto label="Dirección" valor={tutor1Direccion} onChange={setTutor1Direccion} maxLength={255} />
        </div>

        <EncabezadoSeccion titulo="Datos del tutor (2)" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <CampoTexto label="Nombre completo" valor={tutor2Nombre} onChange={setTutor2Nombre} maxLength={120} />
          <CampoTexto label="Num. Tel" valor={tutor2Telefono} onChange={setTutor2Telefono} maxLength={10} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
          <SelectorParentesco valor={tutor2Parentesco} onChange={setTutor2Parentesco} />
          <CampoTexto label="Dirección" valor={tutor2Direccion} onChange={setTutor2Direccion} maxLength={255} />
        </div>

        <EncabezadoSeccion titulo="Contacto de emergencia" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <CampoTexto label="Nombre completo" valor={emergenciaNombre} onChange={setEmergenciaNombre} maxLength={120} />
          <CampoTexto label="Num. Tel" valor={emergenciaTelefono} onChange={setEmergenciaTelefono} maxLength={10} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
          <SelectorParentesco valor={emergenciaParentesco} onChange={setEmergenciaParentesco} />
          <CampoTexto label="Dirección" valor={emergenciaDireccion} onChange={setEmergenciaDireccion} maxLength={255} />
        </div>
        <div style={{ maxWidth: 400, marginTop: 20 }}>
          <CampoTexto
            label="Fecha nacimiento emergencia"
            valor={emergenciaFechaNacimiento}
            onChange={setEmergenciaFechaNacimiento}
            tipo="date"
          />
        </div>

        {mensajeError && (
          <p className="text-[#E66363]" style={{ marginTop: 16, fontSize: 16 }}>
            {mensajeError}
          </p>
        )}

        <div style={{ height: 24 }} />
      </div>

      <div className="shrink-0 flex justify-end" style={{ padding: "16px clamp(20px, 3vw, 48px) 24px" }}>
        <button
          onClick={() => void handleSubmit()}
          disabled={registrando}
          className="border-none cursor-pointer font-normal text-[#3A3A3A] focus:outline-none"
          style={{
            background: registrando ? "#B8DDB1" : "#87D67B",
            borderRadius: 25,
            height: 52,
            width: "clamp(200px, 25vw, 349px)",
            fontSize: "clamp(18px, 1.5vw, 24px)",
            boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
            opacity: registrando ? 0.9 : 1,
          }}
          type="button"
        >
          {registrando
            ? modo === "edicion"
              ? "Guardando..."
              : "Registrando..."
            : modo === "edicion"
              ? "Guardar cambios"
              : "Registrar"}
        </button>
      </div>
    </div>
  );
}
