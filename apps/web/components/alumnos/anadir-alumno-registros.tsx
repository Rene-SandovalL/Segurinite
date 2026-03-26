"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AlumnoMock } from "@/lib/mock/alumnos";
import { asignarAlumnoAGrupo } from "@/lib/api/segurinite";
import { BotonAtras } from "@/components/ui/boton-atras";
import { ToastNotificacion, type ToastData } from "@/components/ui/toast";

interface AnadirAlumnoRegistrosProps {
  grupoId: string;
  alumnos: AlumnoMock[];
}

function nombreCompleto(alumno: AlumnoMock): string {
  return (alumno.nombreCompleto ?? `${alumno.nombre} ${alumno.apellido}`).trim();
}

function normalizarTexto(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function AnadirAlumnoRegistros({ grupoId, alumnos }: AnadirAlumnoRegistrosProps) {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [toast, setToast] = useState<ToastData | null>(null);
  const [cargandoId, setCargandoId] = useState<string | null>(null);
  const [agregadosIds, setAgregadosIds] = useState<Set<string>>(new Set());

  const alumnosOrdenados = useMemo(() => {
    return [...alumnos].sort((a, b) =>
      nombreCompleto(a).localeCompare(nombreCompleto(b), "es", {
        sensitivity: "base",
      }),
    );
  }, [alumnos]);

  const alumnosFiltrados = useMemo(() => {
    const termino = normalizarTexto(busqueda);

    if (!termino) {
      return alumnosOrdenados;
    }

    return alumnosOrdenados.filter((alumno) => {
      const nombre = normalizarTexto(nombreCompleto(alumno));
      return nombre.includes(termino);
    });
  }, [alumnosOrdenados, busqueda]);

  const secciones = useMemo(() => {
    const agrupados = new Map<string, AlumnoMock[]>();

    for (const alumno of alumnosFiltrados) {
      const inicial = nombreCompleto(alumno).charAt(0).toUpperCase() || "#";
      const lista = agrupados.get(inicial) ?? [];
      lista.push(alumno);
      agrupados.set(inicial, lista);
    }

    return Array.from(agrupados.entries()).sort(([letraA], [letraB]) =>
      letraA.localeCompare(letraB, "es", { sensitivity: "base" }),
    );
  }, [alumnosFiltrados]);

  const agregarAlumno = async (alumno: AlumnoMock) => {
    if (cargandoId) {
      return;
    }

    setCargandoId(alumno.id);

    try {
      await asignarAlumnoAGrupo(grupoId, alumno.id);

      setAgregadosIds((actual) => {
        const siguiente = new Set(actual);
        siguiente.add(alumno.id);
        return siguiente;
      });

      setToast({
        mensaje: `${nombreCompleto(alumno)} fue agregado al grupo`,
        color: "#87D67B",
      });
    } catch {
      setToast({
        mensaje: "No se pudo agregar al alumno. Intenta de nuevo.",
        color: "#E66363",
      });
    } finally {
      setCargandoId(null);
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="shrink-0 flex items-center" style={{ padding: "24px 28px 10px", gap: 20 }}>
        <BotonAtras
          onClick={() => {
            router.push(`/groups/${grupoId}`);
            router.refresh();
          }}
        />

        <span className="text-[#3A3A3A] font-normal" style={{ fontSize: "clamp(24px, 2.2vw, 40px)" }}>
          REGISTROS
        </span>
      </div>

      <div className="shrink-0" style={{ padding: "0 48px 12px" }}>
        <label className="relative block">
          <span
            className="absolute bg-white text-[#3A3A3A]"
            style={{
              left: 28,
              top: -10,
              fontSize: 20,
              lineHeight: "20px",
              paddingLeft: 8,
              paddingRight: 8,
            }}
          >
            Buscar
          </span>

          <input
            type="text"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder=""
            className="w-full rounded-[25px] border border-[#3A3A3A] bg-white text-[#3A3A3A] focus:outline-none"
            style={{ height: 64, fontSize: 20, paddingLeft: 28, paddingRight: 60 }}
          />

          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-4 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <path
              d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="#3A3A3A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </label>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ padding: "0 36px 30px" }}>
        {secciones.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#8A8A8A]" style={{ fontSize: 20 }}>
            No se encontraron alumnos con ese criterio.
          </div>
        ) : (
          <div className="space-y-6">
            {secciones.map(([letra, alumnosPorLetra]) => (
              <section key={letra} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <span className="text-[#3A3A3A] font-normal" style={{ fontSize: 24 }}>
                    {letra}
                  </span>

                  <div className="flex-1 border-t-2 border-dashed border-[#3A3A3A]" />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 16,
                  }}
                >
                  {alumnosPorLetra.map((alumno) => {
                    const yaAgregado = agregadosIds.has(alumno.id) || alumno.grupoId === grupoId;
                    const bloqueado = yaAgregado || cargandoId === alumno.id;
                    const colorFranja = alumno.grupoColor ?? "#575EAA";

                    return (
                      <button
                        key={alumno.id}
                        type="button"
                        onClick={() => agregarAlumno(alumno)}
                        disabled={bloqueado}
                        className="relative h-16 rounded-[25px] overflow-hidden text-left"
                        style={{
                          boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
                          opacity: bloqueado ? 0.72 : 1,
                          cursor: bloqueado ? "default" : "pointer",
                        }}
                      >
                        <div className="absolute inset-0 bg-white" />

                                              <div className="absolute left-0 top-0 h-full" style={{ width: 106, background: colorFranja }} />

                        <div
                          className="absolute left-0 top-0 h-full flex items-center justify-center"
                          style={{ width: 106 }}
                        >
                          <span className="text-white font-normal leading-none" style={{ fontSize: 38 }}>
                            {alumno.iniciales}
                          </span>
                        </div>

                        <div className="absolute left-28.25 right-4 top-0 h-full flex items-center justify-center">
                          <span
                            className="text-[#3A3A3A] font-normal text-center leading-tight"
                            style={{ fontSize: "clamp(16px, 1.1vw, 28px)" }}
                          >
                            {nombreCompleto(alumno)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {toast && <ToastNotificacion {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
