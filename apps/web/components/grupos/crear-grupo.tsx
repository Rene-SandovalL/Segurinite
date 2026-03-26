"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  asignarAlumnoAGrupo,
  crearGrupo,
  getAlumnos,
  getColores,
  type ColorGrupoDisponible,
} from "@/lib/api/segurinite";
import type { AlumnoMock } from "@/lib/mock/alumnos";
import { ToastNotificacion, type ToastData } from "@/components/ui/toast";

const MAX_COLORES_PICKER = 20;

function nombreCompletoAlumno(alumno: AlumnoMock): string {
  return (alumno.nombreCompleto ?? `${alumno.nombre} ${alumno.apellido}`).trim();
}

function normalizarTexto(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
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
  const anchoAbierto = 316;
  const altoCerrado = 64;
  const altoAbierto = 252;
  const tamanoSwatch = 52;
  const separacion = 8;

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
        height: abierto ? altoAbierto : altoCerrado,
        maxWidth: "100%",
        transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1), height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
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
          height: "100%",
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
            justifyContent: "center",
          }}
        >
          {abierto ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(5, ${tamanoSwatch}px)`,
                gridTemplateRows: `repeat(4, ${tamanoSwatch}px)`,
                gap: separacion,
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

                      if (bloqueado) {
                        return;
                      }

                      onSeleccionar(color.id);
                      setAbierto(false);
                    }}
                    disabled={bloqueado}
                    style={{
                      width: tamanoSwatch,
                      height: tamanoSwatch,
                      background: color.valorHex,
                      border: seleccionado ? "3px solid #FFFFFF" : "2px solid transparent",
                      borderRadius: 6,
                      cursor: bloqueado ? "not-allowed" : "pointer",
                      outline: seleccionado ? "2px solid #D9D9D9" : "none",
                      opacity: bloqueado ? 0.45 : 1,
                      padding: 0,
                      transition: "transform 0.2s ease, opacity 0.2s ease",
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div
              style={{
                width: tamanoSwatch,
                height: tamanoSwatch,
                background: fondoCerrado,
                border: "3px solid #FFFFFF",
                borderRadius: 6,
                outline: "2px solid #D9D9D9",
              }}
            />
          )}
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
  const [alumnosDisponibles, setAlumnosDisponibles] = useState<AlumnoMock[]>([]);
  const [alumnosSeleccionadosIds, setAlumnosSeleccionadosIds] = useState<string[]>([]);
  const [busquedaAlumnos, setBusquedaAlumnos] = useState("");
  const [colorIdSeleccionado, setColorIdSeleccionado] = useState<number | null>(null);
  const [cargandoColores, setCargandoColores] = useState(true);
  const [cargandoAlumnos, setCargandoAlumnos] = useState(true);
  const [guardandoGrupo, setGuardandoGrupo] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const coloresPicker = useMemo(() => {
    return [...colores].slice(0, MAX_COLORES_PICKER);
  }, [colores]);

  const alumnosFiltrados = useMemo(() => {
    const termino = normalizarTexto(busquedaAlumnos);

    const ordenados = [...alumnosDisponibles].sort((alumnoA, alumnoB) =>
      nombreCompletoAlumno(alumnoA).localeCompare(nombreCompletoAlumno(alumnoB), "es", {
        sensitivity: "base",
      }),
    );

    if (!termino) {
      return ordenados;
    }

    return ordenados.filter((alumno) =>
      normalizarTexto(nombreCompletoAlumno(alumno)).includes(termino),
    );
  }, [alumnosDisponibles, busquedaAlumnos]);

  const cargarColores = async () => {
    setCargandoColores(true);

    try {
      const respuesta = await getColores();
      setColores(respuesta);
    } catch (error) {
      setMensajeError((actual) =>
        actual ?? (error instanceof Error ? error.message : "No se pudieron cargar los colores."),
      );
    } finally {
      setCargandoColores(false);
    }
  };

  const cargarAlumnos = async () => {
    setCargandoAlumnos(true);

    try {
      const respuesta = await getAlumnos();
      setAlumnosDisponibles(respuesta);
    } catch (error) {
      setMensajeError((actual) =>
        actual ?? (error instanceof Error ? error.message : "No se pudieron cargar los alumnos."),
      );
    } finally {
      setCargandoAlumnos(false);
    }
  };

  useEffect(() => {
    setMensajeError(null);
    void Promise.all([cargarColores(), cargarAlumnos()]);
  }, []);

  const toggleAlumnoSeleccionado = (alumnoId: string) => {
    setAlumnosSeleccionadosIds((actuales) => {
      if (actuales.includes(alumnoId)) {
        return actuales.filter((id) => id !== alumnoId);
      }

      return [...actuales, alumnoId];
    });
  };

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

      let cantidadAsignada = 0;

      if (alumnosSeleccionadosIds.length > 0) {
        const resultados = await Promise.allSettled(
          alumnosSeleccionadosIds.map((alumnoId) => asignarAlumnoAGrupo(grupo.id, alumnoId)),
        );

        cantidadAsignada = resultados.filter((resultado) => resultado.status === "fulfilled").length;
      }

      const huboFallosAsignando =
        alumnosSeleccionadosIds.length > 0 && cantidadAsignada < alumnosSeleccionadosIds.length;

      setToast(
        huboFallosAsignando
          ? {
              mensaje: `Grupo creado. ${cantidadAsignada}/${alumnosSeleccionadosIds.length} alumnos agregados.`,
              color: "#E66363",
            }
          : {
              mensaje:
                alumnosSeleccionadosIds.length > 0
                  ? `Grupo creado con ${cantidadAsignada} alumnos.`
                  : "Grupo creado correctamente",
              color: "#87D67B",
            },
      );

      setTimeout(() => {
        router.push(`/groups/${grupo.id}`);
        router.refresh();
      }, 650);
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : "No se pudo crear el grupo.");
    } finally {
      setGuardandoGrupo(false);
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
          </div>

          {cargandoColores ? (
            <p className="text-[#8A8A8A]" style={{ fontSize: 16 }}>
              Cargando colores...
            </p>
          ) : coloresPicker.length === 0 ? (
            <p className="text-[#8A8A8A]" style={{ fontSize: 16 }}>
              No hay colores registrados.
            </p>
          ) : (
            <SelectorColorExpandible
              colores={coloresPicker}
              colorIdSeleccionado={colorIdSeleccionado}
              onSeleccionar={setColorIdSeleccionado}
            />
          )}
        </div>

        <div className="flex items-baseline gap-3" style={{ marginTop: 26, marginBottom: 8 }}>
          <span className="text-[#3A3A3A] font-normal" style={{ fontSize: 24 }}>
            Integrantes
          </span>
          <span className="text-[#8A8A8A] font-normal" style={{ fontSize: 16 }}>
            (Selecciona alumnos para agregarlos al crear el grupo)
          </span>
        </div>
        <div style={{ height: 1, background: "#3A3A3A", marginBottom: 28 }} />

        <div style={{ maxWidth: 760 }}>
          <div className="relative" style={{ marginBottom: 14, paddingTop: 10 }}>
            <input
              type="text"
              value={busquedaAlumnos}
              onChange={(event) => setBusquedaAlumnos(event.target.value)}
              className="w-full bg-white text-[#3A3A3A] focus:outline-none"
              style={{
                border: "1px solid #3A3A3A",
                borderRadius: 25,
                height: 56,
                paddingLeft: 24,
                paddingRight: 24,
                fontSize: 16,
              }}
            />

            <span
              className="absolute bg-white text-[#3A3A3A] pointer-events-none"
              style={{ top: 0, left: 18, fontSize: 16, lineHeight: "20px", paddingLeft: 4, paddingRight: 4 }}
            >
              Buscar alumno
            </span>
          </div>

          <div
            className="rounded-2xl"
            style={{
              border: "1px solid #D0D0D0",
              background: "#F8F8F8",
              maxHeight: 240,
              overflowY: "auto",
              padding: 10,
            }}
          >
            {cargandoAlumnos ? (
              <p className="text-[#8A8A8A]" style={{ fontSize: 15 }}>
                Cargando alumnos...
              </p>
            ) : alumnosFiltrados.length === 0 ? (
              <p className="text-[#8A8A8A]" style={{ fontSize: 15 }}>
                No hay alumnos para mostrar.
              </p>
            ) : (
              <div className="flex flex-col" style={{ gap: 8 }}>
                {alumnosFiltrados.map((alumno) => {
                  const seleccionado = alumnosSeleccionadosIds.includes(alumno.id);

                  return (
                    <button
                      key={alumno.id}
                      type="button"
                      onClick={() => toggleAlumnoSeleccionado(alumno.id)}
                      className="w-full border-none flex items-center justify-between"
                      style={{
                        minHeight: 42,
                        borderRadius: 12,
                        padding: "0 14px",
                        background: seleccionado ? "#D9F0D4" : "#FFFFFF",
                        color: "#3A3A3A",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontSize: 15, textTransform: "uppercase" }}>
                        {nombreCompletoAlumno(alumno)}
                      </span>

                      <span style={{ fontSize: 13, color: seleccionado ? "#2E7D32" : "#8A8A8A" }}>
                        {seleccionado ? "Seleccionado" : "Seleccionar"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-[#8A8A8A]" style={{ marginTop: 10, fontSize: 14 }}>
            Seleccionados: {alumnosSeleccionadosIds.length}
          </p>
        </div>

        <div style={{ height: 20 }} />

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