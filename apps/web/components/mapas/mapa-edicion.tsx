"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  actualizarPosicionBeacon,
  type AlumnoMapaMock,
} from "@/lib/api/segurinite";
import type { BeaconMock } from "@/lib/mock/beacons";
import type { MapaConBeaconsMock } from "@/lib/mock/mapas";
import type { ZonaMock } from "@/lib/mock/zonas";
import { useTelemetriaSocket } from "@/hooks/useTelemetriaSocket";
import { ToastNotificacion, type ToastData } from "@/components/ui/toast";

const COLOR_BEACON_PREDETERMINADO = "#575EAA";

interface MapaEdicionProps {
  mapa: MapaConBeaconsMock;
  beaconsSinPosicionIniciales: BeaconMock[];
  zonas: ZonaMock[];
  /** Solo se dibujan alumnos si se pasan ambos — pensado para /groups/[grupoId]/mapa */
  grupoId?: string;
  alumnosMapa?: AlumnoMapaMock[];
}

interface BeaconMarcadorProps {
  beacon: BeaconMock;
  modoEdicion: boolean;
  onHoverChange: (beaconId: number | null) => void;
}

interface AlumnoPosicionado {
  alumnoId: string;
  nombre: string;
  estado: "normal" | "alerta" | "peligro";
  bpm: number | null;
  spo2: number | null;
  temp: number | null;
  x: number;
  y: number;
}

function etiquetaBeacon(beacon: BeaconMock): string {
  return beacon.nombre ?? `Beacon ${beacon.beaconId}`;
}

function inicialesDeNombre(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  const primero = partes[0]?.charAt(0) ?? "";
  const segundo = partes[1]?.charAt(0) ?? "";
  return `${primero}${segundo}`.toUpperCase();
}

/** Offset en % alrededor de un beacon para que los alumnos no se encimen. */
function calcularOffset(index: number, total: number): { dx: number; dy: number } {
  const RADIO = 4.5;
  const angulo = -Math.PI / 2 + (index / Math.max(total, 1)) * 2 * Math.PI;
  return { dx: RADIO * Math.cos(angulo), dy: RADIO * Math.sin(angulo) };
}

function BeaconMarcadorDraggable({
  beacon,
  modoEdicion,
  onHoverChange,
}: BeaconMarcadorProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `beacon-${beacon.id}`,
    disabled: !modoEdicion,
  });

  const dragTransform = transform ? CSS.Translate.toString(transform) : "";
  const color = beacon.color?.valorHex ?? COLOR_BEACON_PREDETERMINADO;

  return (
    <div
      ref={setNodeRef}
      className={modoEdicion ? "touch-none cursor-grab group" : "group"}
      style={{
        position: "absolute",
        left: `${(beacon.posX ?? 0) * 100}%`,
        top: `${(beacon.posY ?? 0) * 100}%`,
        transform: `translate(-50%, -50%) ${dragTransform}`,
        zIndex: isDragging ? 30 : 2,
      }}
      onMouseEnter={() => onHoverChange(beacon.id)}
      onMouseLeave={() => onHoverChange(null)}
      {...(modoEdicion ? listeners : {})}
      {...(modoEdicion ? attributes : {})}
    >
      <span
        className="flex items-center justify-center transition-all duration-200 ease-out w-6 h-6 group-hover:w-12 group-hover:h-12"
        style={{
          background: color,
          border: "2px solid #3A3A3A",
          borderRadius: 6,
          boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
        }}
      >
        <span
          className="text-white font-normal select-none pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{ fontSize: 12 }}
        >
          {beacon.beaconId}
        </span>
      </span>
    </div>
  );
}

function BeaconTokenDraggable({
  beacon,
  modoEdicion,
}: {
  beacon: BeaconMock;
  modoEdicion: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `beacon-${beacon.id}`,
    disabled: !modoEdicion,
  });

  const color = beacon.color?.valorHex ?? COLOR_BEACON_PREDETERMINADO;

  return (
    <div
      ref={setNodeRef}
      className={modoEdicion ? "touch-none cursor-grab" : ""}
      style={{
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        zIndex: isDragging ? 30 : 1,
        opacity: isDragging ? 0.4 : 1,
      }}
      {...(modoEdicion ? listeners : {})}
      {...(modoEdicion ? attributes : {})}
    >
      <div
        className="flex items-center"
        style={{
          gap: 10,
          border: "1px solid #3A3A3A",
          borderRadius: 12,
          padding: "8px 12px",
          background: "#fff",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        <span
          className="shrink-0"
          style={{
            width: 14,
            height: 14,
            borderRadius: 3,
            background: color,
            border: "1px solid #3A3A3A",
          }}
        />
        <span className="text-[#3A3A3A]" style={{ fontSize: 14, whiteSpace: "nowrap" }}>
          {etiquetaBeacon(beacon)}
        </span>
      </div>
    </div>
  );
}

export function MapaEdicion({
  mapa,
  beaconsSinPosicionIniciales,
  zonas,
  grupoId,
  alumnosMapa,
}: MapaEdicionProps) {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [beaconsPosicionados, setBeaconsPosicionados] = useState<BeaconMock[]>(
    mapa.beacons.filter((beacon) => beacon.posX !== null && beacon.posY !== null),
  );
  const [beaconsSinPosicion, setBeaconsSinPosicion] = useState<BeaconMock[]>(
    beaconsSinPosicionIniciales,
  );
  const [estadosAlumnos, setEstadosAlumnos] = useState<Map<string, AlumnoMapaMock>>(
    () => new Map((alumnosMapa ?? []).map((alumno) => [alumno.alumnoId, alumno])),
  );
  const [beaconHoverId, setBeaconHoverId] = useState<number | null>(null);
  const [alumnoHoverId, setAlumnoHoverId] = useState<string | null>(null);
  const [arrastrandoAlgo, setArrastrandoAlgo] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const zonasPorId = useMemo(() => new Map(zonas.map((zona) => [zona.id, zona])), [zonas]);

  const beaconHover = useMemo(() => {
    const todos = [...beaconsPosicionados, ...beaconsSinPosicion];
    return todos.find((beacon) => beacon.id === beaconHoverId) ?? null;
  }, [beaconsPosicionados, beaconsSinPosicion, beaconHoverId]);

  const alumnoIdsDelGrupo = useMemo(
    () => new Set((alumnosMapa ?? []).map((alumno) => alumno.alumnoId)),
    [alumnosMapa],
  );

  useTelemetriaSocket((evento) => {
    if (!alumnoIdsDelGrupo.has(evento.alumnoId)) {
      return;
    }

    setEstadosAlumnos((actual) => {
      const previo = actual.get(evento.alumnoId);
      if (!previo) {
        return actual;
      }

      const actualizado = new Map(actual);
      actualizado.set(evento.alumnoId, {
        ...previo,
        ultimoBeaconId: evento.beaconId,
        ultimoBpm: evento.bpm,
        ultimoSpo2: evento.spo2,
        ultimaTemp: evento.temp,
      });
      return actualizado;
    });
  });

  const beaconPosPorBeaconId = useMemo(() => {
    const lookup = new Map<number, { x: number; y: number }>();
    beaconsPosicionados.forEach((beacon) => {
      if (beacon.posX !== null && beacon.posY !== null) {
        lookup.set(beacon.beaconId, { x: beacon.posX * 100, y: beacon.posY * 100 });
      }
    });
    return lookup;
  }, [beaconsPosicionados]);

  const { alumnosPosicionados, alumnosSinUbicacion } = useMemo(() => {
    const posicionados: AlumnoPosicionado[] = [];
    const sinUbicacion: AlumnoMapaMock[] = [];
    const porBeacon = new Map<number, AlumnoMapaMock[]>();

    estadosAlumnos.forEach((alumno) => {
      const beaconId = alumno.ultimoBeaconId;
      if (beaconId === null || !beaconPosPorBeaconId.has(beaconId)) {
        sinUbicacion.push(alumno);
        return;
      }

      const lista = porBeacon.get(beaconId) ?? [];
      lista.push(alumno);
      porBeacon.set(beaconId, lista);
    });

    porBeacon.forEach((lista, beaconId) => {
      const pos = beaconPosPorBeaconId.get(beaconId);
      if (!pos) {
        return;
      }

      lista.forEach((alumno, index) => {
        const { dx, dy } = calcularOffset(index, lista.length);
        posicionados.push({
          alumnoId: alumno.alumnoId,
          nombre: alumno.nombre,
          estado: alumno.estado,
          bpm: alumno.ultimoBpm,
          spo2: alumno.ultimoSpo2,
          temp: alumno.ultimaTemp,
          x: Math.min(100, Math.max(0, pos.x + dx)),
          y: Math.min(100, Math.max(0, pos.y + dy)),
        });
      });
    });

    return { alumnosPosicionados: posicionados, alumnosSinUbicacion: sinUbicacion };
  }, [estadosAlumnos, beaconPosPorBeaconId]);

  const alumnoHover = alumnoHoverId
    ? alumnosPosicionados.find((alumno) => alumno.alumnoId === alumnoHoverId) ?? null
    : null;

  async function guardarPosicion(beaconId: number, posX: number, posY: number) {
    try {
      const actualizado = await actualizarPosicionBeacon(beaconId, {
        posX,
        posY,
        mapaId: mapa.id,
      });

      setBeaconsSinPosicion((actual) => actual.filter((beacon) => beacon.id !== beaconId));
      setBeaconsPosicionados((actual) => [
        ...actual.filter((beacon) => beacon.id !== beaconId),
        actualizado,
      ]);
    } catch (error) {
      setToast({
        mensaje:
          error instanceof Error ? error.message : "No se pudo actualizar la posición",
        color: "#E66363",
      });
    }
  }

  function onDragStart() {
    setArrastrandoAlgo(true);
  }

  function onDragEnd(event: DragEndEvent) {
    setArrastrandoAlgo(false);

    if (!containerRef.current) {
      return;
    }

    const initialRect = event.active.rect.current.initial;
    if (!initialRect) {
      return;
    }

    const centerX = initialRect.left + initialRect.width / 2 + event.delta.x;
    const centerY = initialRect.top + initialRect.height / 2 + event.delta.y;

    const containerRect = containerRef.current.getBoundingClientRect();

    const dentroDelMapa =
      centerX >= containerRect.left &&
      centerX <= containerRect.right &&
      centerY >= containerRect.top &&
      centerY <= containerRect.bottom;

    if (!dentroDelMapa) {
      return;
    }

    const beaconId = Number(String(event.active.id).replace("beacon-", ""));
    const posX = Math.min(
      1,
      Math.max(0, (centerX - containerRect.left) / containerRect.width),
    );
    const posY = Math.min(
      1,
      Math.max(0, (centerY - containerRect.top) / containerRect.height),
    );

    void guardarPosicion(beaconId, posX, posY);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setArrastrandoAlgo(false)}
    >
      <div
        className="h-full w-full flex flex-col overflow-hidden"
        style={{ paddingTop: 10, paddingInline: 10, paddingBottom: 10 }}
      >
        <div
          ref={containerRef}
          className="relative flex-1 overflow-hidden"
          style={{
            borderRadius: 30,
            boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
            border: arrastrandoAlgo ? "3px dashed #575EAA" : "none",
          }}
        >
          <Image src={mapa.imagenUrl} alt={mapa.nombre} fill style={{ objectFit: "cover" }} />

          {/* ── Controles flotantes (arriba a la derecha) ─────── */}
          <div
            className="absolute right-3 top-3 z-30 flex items-center"
            style={{ gap: 10 }}
          >
            <span
              className="rounded-full"
              style={{
                background: "#3A3A3ACC",
                color: "#fff",
                fontSize: 14,
                padding: "8px 16px",
              }}
            >
              {mapa.nombre}
            </span>

            <button
              onClick={() => setModoEdicion((activo) => !activo)}
              className="border-none cursor-pointer font-normal text-white rounded-full"
              style={{
                background: modoEdicion ? "#E66363" : "#87D67B",
                height: 38,
                padding: "0 18px",
                fontSize: 14,
                boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
              }}
              type="button"
            >
              {modoEdicion ? "Salir de modo edición" : "Modo edición"}
            </button>
          </div>

          {/* ── Tarjeta de hover (arriba a la izquierda) ──────── */}
          {beaconHover && (
            <div
              className="absolute left-3 top-3 z-20 rounded-[14px]"
              style={{
                background: "#3A3A3ACC",
                color: "#fff",
                padding: "14px 16px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.24)",
                width: "min(320px, calc(100% - 24px))",
              }}
            >
              <p className="font-bold" style={{ fontSize: 17, lineHeight: 1.3 }}>
                {etiquetaBeacon(beaconHover)}
              </p>
              <p style={{ fontSize: 14, marginTop: 6, opacity: 0.9 }}>
                beacon_id: {beaconHover.beaconId}
              </p>
              <p style={{ fontSize: 14, opacity: 0.9 }}>
                Zona: {zonasPorId.get(beaconHover.zonaId)?.nombre ?? "—"}
              </p>
              <p style={{ fontSize: 14, opacity: 0.9 }}>
                MAC: {beaconHover.macAddress ?? "—"}
              </p>
              <p style={{ fontSize: 14, opacity: 0.9 }}>
                Estado: {beaconHover.activo ? "Activo" : "Inactivo"}
              </p>
            </div>
          )}

          {!beaconHover && alumnoHover && (
            <div
              className="absolute left-3 top-3 z-20 rounded-[14px]"
              style={{
                background: "#3A3A3ACC",
                color: "#fff",
                padding: "14px 16px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.24)",
                width: "min(320px, calc(100% - 24px))",
              }}
            >
              <p className="font-bold" style={{ fontSize: 17, lineHeight: 1.3 }}>
                {alumnoHover.nombre}
              </p>
              <p style={{ fontSize: 14, marginTop: 6, opacity: 0.9 }}>
                {alumnoHover.bpm != null ? `${alumnoHover.bpm} bpm` : "— bpm"} ·{" "}
                {alumnoHover.spo2 != null ? `${alumnoHover.spo2}% SpO2` : "— SpO2"}
              </p>
              <p style={{ fontSize: 14, opacity: 0.9 }}>
                Temp: {alumnoHover.temp != null ? `${alumnoHover.temp}°C` : "—"}
              </p>
              <p style={{ fontSize: 14, opacity: 0.9 }}>Estado: {alumnoHover.estado}</p>
            </div>
          )}

          {/* ── Alumnos posicionados por su último beacon ─────── */}
          {grupoId &&
            alumnosPosicionados.map((alumno) => {
              const colorBorde =
                alumno.estado === "peligro"
                  ? "#E56363"
                  : alumno.estado === "alerta"
                    ? "#F5A623"
                    : "#3A3A3A";
              const sombra =
                alumno.estado === "peligro"
                  ? "0 0 4px 4px #FF6060"
                  : "0 4px 4px 0 rgba(0,0,0,0.25)";

              return (
                <Link
                  key={alumno.alumnoId}
                  href={`/groups/${grupoId}/alumnos/${alumno.alumnoId}`}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  style={{
                    left: `${alumno.x}%`,
                    top: `${alumno.y}%`,
                    zIndex: 1,
                    transition: "left 0.6s ease, top 0.6s ease",
                  }}
                  aria-label={`Ver información de ${alumno.nombre}`}
                  onMouseEnter={() => setAlumnoHoverId(alumno.alumnoId)}
                  onMouseLeave={() =>
                    setAlumnoHoverId((actual) => (actual === alumno.alumnoId ? null : actual))
                  }
                  onFocus={() => setAlumnoHoverId(alumno.alumnoId)}
                  onBlur={() =>
                    setAlumnoHoverId((actual) => (actual === alumno.alumnoId ? null : actual))
                  }
                >
                  <span
                    className="flex items-center justify-center rounded-full transition-all duration-200 ease-out w-6 h-6 group-hover:w-14 group-hover:h-14 group-focus-visible:w-14 group-focus-visible:h-14"
                    style={{
                      background: "#575EAA",
                      border: `2px solid ${colorBorde}`,
                      boxShadow: sombra,
                    }}
                  >
                    <span
                      className="text-white font-normal select-none pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                      style={{ fontSize: 14, lineHeight: 1 }}
                    >
                      {inicialesDeNombre(alumno.nombre)}
                    </span>
                  </span>
                </Link>
              );
            })}

          {/* ── Beacons posicionados (cuadrados, arrastrables) ── */}
          {beaconsPosicionados.map((beacon) => (
            <BeaconMarcadorDraggable
              key={beacon.id}
              beacon={beacon}
              modoEdicion={modoEdicion}
              onHoverChange={setBeaconHoverId}
            />
          ))}

          {/* ── Beacons sin posición (abajo a la izquierda) ───── */}
          {modoEdicion && beaconsSinPosicion.length > 0 && (
            <div
              className="absolute left-3 bottom-3 z-20 flex flex-col overflow-y-auto"
              style={{ gap: 8, maxHeight: "40%", maxWidth: "calc(100% - 24px)" }}
            >
              {beaconsSinPosicion.map((beacon) => (
                <BeaconTokenDraggable key={beacon.id} beacon={beacon} modoEdicion={modoEdicion} />
              ))}
            </div>
          )}

          {/* ── Alumnos sin ubicación (abajo a la derecha) ────── */}
          {grupoId && alumnosSinUbicacion.length > 0 && (
            <div
              className="absolute right-3 bottom-3 z-20 flex flex-col overflow-y-auto"
              style={{ gap: 8, maxHeight: "40%", maxWidth: "calc(100% - 24px)" }}
            >
              {alumnosSinUbicacion.map((alumno) => (
                <div
                  key={alumno.alumnoId}
                  className="flex items-center"
                  style={{
                    gap: 10,
                    border: "1px solid #3A3A3A",
                    borderRadius: 12,
                    padding: "8px 12px",
                    background: "#fff",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <span
                    className="shrink-0 rounded-full"
                    style={{ width: 14, height: 14, background: "#575EAA", border: "1px solid #3A3A3A" }}
                  />
                  <span className="text-[#3A3A3A]" style={{ fontSize: 14, whiteSpace: "nowrap" }}>
                    {alumno.nombre} — sin ubicación
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {toast && <ToastNotificacion {...toast} onDismiss={() => setToast(null)} />}
    </DndContext>
  );
}
