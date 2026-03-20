"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  crearColor,
  crearGrupo,
  getColores,
  type ColorGrupoDisponible,
} from "@/lib/api/segurinite";
import { ToastNotificacion, type ToastData } from "@/components/ui/toast";

function esHexValido(valor: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(valor.trim());
}

interface SelectorColorExpandibleProps {
  colores: ColorGrupoDisponible[];
  colorIdSeleccionado: number | null;
  onSeleccionar: (id: number) => void;
}

function SelectorColorExpandible({
  colores,
  colorIdSeleccionado,
  onSeleccionar,
}: SelectorColorExpandibleProps) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  const colorSeleccionado =
    colores.find((color) => color.id === colorIdSeleccionado) ?? null;
  const fondoCerrado = colorSeleccionado?.valorHex ?? "#D9D9D9";

  const anchoCerrado = 200;
  const tamanoSwatch = 52;
  const separacion = 8;
  const anchoAbiertoMaximo = 760;
  const anchoAbiertoCalculado =
    colores.length * tamanoSwatch + Math.max(0, colores.length - 1) * separacion + 16;
  const anchoAbierto = Math.min(
    anchoAbiertoMaximo,
    Math.max(anchoCerrado, anchoAbiertoCalculado),
  );

  useEffect(() => {
    if (!abierto) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(event.target as Node)
      ) {
        setAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [abierto]);

  return (
    <div
      ref={contenedorRef}
      className="relative flex items-center justify-center"
      style={{
        width: abierto ? anchoAbierto : anchoCerrado,
        maxWidth: "100%",
        transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        margin: "14px auto 0",
      }}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center"
        style={{
          top: -26,
          background: abierto ? "#3A3A3A" : fondoCerrado,
          border: "1px solid #3A3A3A",
          borderBottom: "none",
          borderRadius: "6px 6px 0 0",
          padding: "1px 16px 0",
          whiteSpace: "nowrap",
          transition: "background 0.3s ease",
          zIndex: 1,
        }}
      >
        <span
          className="font-normal"
          style={{
            fontSize: 18,
            color: abierto ? "#FFFFFF" : "#3A3A3A",
            transition: "color 0.3s ease",
          }}
        >
          Color
        </span>
      </div>

      <div
        role="button"
        aria-expanded={abierto}
        onClick={!abierto ? () => setAbierto(true) : undefined}
        className="flex items-center w-full"
        style={{
          height: 64,
          background: abierto ? "#3A3A3A" : fondoCerrado,
          border: "1px solid #3A3A3A",
          borderRadius: 10,
          transition: "background 0.3s ease",
          cursor: abierto ? "default" : "pointer",
          padding: "0 8px",
          boxSizing: "border-box",
        }}
      >
        <div
          className="flex items-center w-full"
          style={{
            gap: abierto ? separacion : 0,
            overflowX: abierto ? "auto" : "hidden",
            justifyContent: abierto ? "flex-start" : "center",
            scrollbarWidth: "none",
          }}
        >
          {colores.map((color) => {
            const seleccionado = color.id === colorIdSeleccionado;
            const bloqueado = color.ocupado && !seleccionado;

            return (
              <button
                key={color.id}
                type="button"
                aria-label={color.nombre ?? color.valorHex}
                title={bloqueado ? "Color ocupado" : color.nombre ?? color.valorHex}
                onClick={(event) => {
                  event.stopPropagation();

                  if (!abierto || bloqueado) {
                    return;
                  }

                  onSeleccionar(color.id);
                  setAbierto(false);
                }}
                disabled={!abierto || bloqueado}
                style={{
                  flexShrink: 0,
                  width: abierto ? tamanoSwatch : 0,
                  height: abierto ? tamanoSwatch : 0,
                  background: color.valorHex,
                  border: seleccionado ? "3px solid #FFFFFF" : "2px solid transparent",
                  borderRadius: 6,
                  cursor: abierto
                    ? bloqueado
                      ? "not-allowed"
                      : "pointer"
                    : "default",
                  outline: seleccionado ? "2px solid #D9D9D9" : "none",
                  opacity: abierto ? (bloqueado ? 0.45 : 1) : 0,
                  padding: 0,
                  transition:
                    "width 0.3s ease, height 0.3s ease, opacity 0.2s ease 0.1s",
                }}
              />
            );
          })}
        </div>
      </div>

      {colorSeleccionado && (
        <span
          className="absolute text-[#8A8A8A]"
          style={{ bottom: -24, fontSize: 13 }}
        >
          {colorSeleccionado.nombre ?? colorSeleccionado.valorHex}
        </span>
      )}
    </div>
  );
}

export function CrearGrupo() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [colores, setColores] = useState<ColorGrupoDisponible[]>([]);
  const [colorIdSeleccionado, setColorIdSeleccionado] = useState<number | null>(null);
  const [mostrarAgregarColor, setMostrarAgregarColor] = useState(false);
  const [nuevoColorNombre, setNuevoColorNombre] = useState("");
  const [nuevoColorHex, setNuevoColorHex] = useState("#");
  const [cargandoColores, setCargandoColores] = useState(true);
  const [guardandoGrupo, setGuardandoGrupo] = useState(false);
  const [guardandoColor, setGuardandoColor] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const coloresOrdenados = useMemo(() => {
    return [...colores].sort((a, b) => a.valorHex.localeCompare(b.valorHex));
  }, [colores]);

  const cargarColores = async () => {
    setCargandoColores(true);
    setMensajeError(null);

    try {
      const respuesta = await getColores();
      setColores(respuesta);
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : "No se pudieron cargar los colores.");
    } finally {
      setCargandoColores(false);
    }
  };

  useEffect(() => {
    void cargarColores();
  }, []);

  const handleCrearGrupo = async () => {
    setMensajeError(null);

    if (!nombre.trim()) {
      setMensajeError("Ingresa el nombre del grupo.");
      return;
    }

    if (!colorIdSeleccionado) {
      setMensajeError("Selecciona un color disponible.");
      return;
    }

    setGuardandoGrupo(true);

    try {
      const grupo = await crearGrupo({
        nombre: nombre.trim(),
        colorId: colorIdSeleccionado,
      });

      setToast({
        mensaje: "Grupo creado correctamente",
        color: "#87D67B",
      });

      setTimeout(() => {
        router.push(`/groups/${grupo.id}`);
      }, 650);
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : "No se pudo crear el grupo.");
    } finally {
      setGuardandoGrupo(false);
    }
  };

  const handleAgregarColor = async () => {
    setMensajeError(null);

    if (!esHexValido(nuevoColorHex)) {
      setMensajeError("El color debe tener formato hexadecimal #RRGGBB.");
      return;
    }

    setGuardandoColor(true);

    try {
      const creado = await crearColor({
        nombre: nuevoColorNombre.trim() || undefined,
        valorHex: nuevoColorHex.trim().toUpperCase(),
      });

      setColores((actual) => [...actual, creado]);
      setColorIdSeleccionado(creado.id);
      setNuevoColorNombre("");
      setNuevoColorHex("#");
      setMostrarAgregarColor(false);

      setToast({
        mensaje: "Color agregado correctamente",
        color: "#87D67B",
      });
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : "No se pudo agregar el color.");
    } finally {
      setGuardandoColor(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="shrink-0 flex items-center gap-5" style={{ padding: "28px 28px 20px" }}>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full bg-white border-none cursor-pointer flex items-center justify-center shrink-0 focus:outline-none"
          style={{ width: 44, height: 44, boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
          aria-label="Volver"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L3 12L9 6L10.4 7.4L6.8 11H19V7H21V13H6.8L10.4 16.6L9 18Z" fill="#1D1B20" />
          </svg>
        </button>

        <span className="text-[#3A3A3A] font-normal" style={{ fontSize: "clamp(22px, 2.5vw, 32px)" }}>
          CREAR NUEVO GRUPO
        </span>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col" style={{ padding: "0 clamp(32px, 6vw, 108px)" }}>
        <div className="flex flex-col" style={{ gap: 2, marginBottom: 24 }}>
          <span className="text-[#3A3A3A] font-normal" style={{ fontSize: 24 }}>
            Datos generales
          </span>
          <div style={{ height: 1, background: "#3A3A3A" }} />
        </div>

        <div
          className="relative w-full"
          style={{ maxWidth: "clamp(300px, 44vw, 594px)", paddingBottom: 18, paddingTop: 10 }}
        >
          <input
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            maxLength={60}
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
            style={{ top: 0, left: 20, fontSize: 18, lineHeight: "20px", paddingLeft: 4, paddingRight: 4 }}
          >
            Nombre del grupo
          </span>
        </div>

        <div style={{ marginTop: 16 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
            <span className="text-[#3A3A3A]" style={{ fontSize: 20 }}>
              Color del grupo
            </span>

            <button
              type="button"
              className="rounded-[18px] border-none text-[#3A3A3A]"
              style={{
                background: "#D9D9D9",
                height: 42,
                padding: "0 16px",
                fontSize: 16,
                boxShadow: "0 4px 4px 0 rgba(0,0,0,0.2)",
                cursor: "pointer",
              }}
              onClick={() => setMostrarAgregarColor((actual) => !actual)}
            >
              Agregar color
            </button>
          </div>

          {cargandoColores ? (
            <p className="text-[#8A8A8A]" style={{ fontSize: 16 }}>
              Cargando colores...
            </p>
          ) : coloresOrdenados.length === 0 ? (
            <p className="text-[#8A8A8A]" style={{ fontSize: 16 }}>
              No hay colores registrados.
            </p>
          ) : (
            <SelectorColorExpandible
              colores={coloresOrdenados}
              colorIdSeleccionado={colorIdSeleccionado}
              onSeleccionar={setColorIdSeleccionado}
            />
          )}

          {mostrarAgregarColor && (
            <div
              className="rounded-[18px] bg-[#F3F3F3]"
              style={{ marginTop: 28, padding: 16, maxWidth: 560 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 180px auto", gap: 12 }}>
                <input
                  type="text"
                  value={nuevoColorNombre}
                  onChange={(event) => setNuevoColorNombre(event.target.value)}
                  placeholder="Nombre (opcional)"
                  className="bg-white text-[#3A3A3A] focus:outline-none"
                  style={{ border: "1px solid #B8B8B8", borderRadius: 12, padding: "0 12px", height: 42 }}
                />

                <input
                  type="text"
                  value={nuevoColorHex}
                  onChange={(event) => setNuevoColorHex(event.target.value)}
                  placeholder="#RRGGBB"
                  className="bg-white text-[#3A3A3A] focus:outline-none"
                  style={{ border: "1px solid #B8B8B8", borderRadius: 12, padding: "0 12px", height: 42 }}
                />

                <button
                  type="button"
                  onClick={() => void handleAgregarColor()}
                  disabled={guardandoColor}
                  className="border-none"
                  style={{
                    borderRadius: 12,
                    height: 42,
                    padding: "0 16px",
                    background: "#87D67B",
                    color: "#3A3A3A",
                    cursor: "pointer",
                  }}
                >
                  {guardandoColor ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-3" style={{ marginTop: 26, marginBottom: 8 }}>
          <span className="text-[#3A3A3A] font-normal" style={{ fontSize: 24 }}>
            Integrantes
          </span>
          <span className="text-[#8A8A8A] font-normal" style={{ fontSize: 16 }}>
            (Puedes agregar integrantes después de crear el grupo)
          </span>
        </div>
        <div style={{ height: 1, background: "#3A3A3A", marginBottom: 28 }} />

        <div style={{ height: 24 }} />

        {mensajeError && (
          <p className="text-[#E66363]" style={{ marginBottom: 16, fontSize: 16 }}>
            {mensajeError}
          </p>
        )}
      </div>

      <div className="shrink-0 flex justify-end" style={{ padding: "16px clamp(24px, 4vw, 60px) 28px" }}>
        <button
          onClick={() => void handleCrearGrupo()}
          disabled={guardandoGrupo}
          className="border-none cursor-pointer font-normal text-[#3A3A3A] focus:outline-none"
          style={{
            background: guardandoGrupo ? "#B8DDB1" : "#87D67B",
            borderRadius: 25,
            height: 52,
            width: "clamp(200px, 25vw, 349px)",
            fontSize: "clamp(18px, 1.5vw, 24px)",
            boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
          }}
          type="button"
        >
          {guardandoGrupo ? "Creando..." : "Crear grupo"}
        </button>
      </div>

      {toast && <ToastNotificacion {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}