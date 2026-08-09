"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GrupoHeader } from "@/components/grupos/grupo-header";
import { BotonAtras } from "@/components/ui/boton-atras";
import {
  getAlertasPorGrupo,
  getAlertasPorSeveridad,
  getAlertasPorTipo,
  getAlertasSerieDiaria,
  getEstadisticasAsistencia,
  getRankingAlumnosAlertas,
  getRankingFaltas,
  getTiempoEnEscuela,
  getTiempoResolucionPromedio,
  getVitalesPromedioGrupo,
} from "@/lib/api/segurinite";
import type { GrupoMock } from "@/lib/mock/grupos";
import { COLOR_ALERTA_SEVERIDAD, ETIQUETA_ALERTA_TIPO } from "@/types/alerta";
import type {
  ConteoPorGrupo,
  ConteoPorSeveridad,
  ConteoPorTipo,
  EstadisticasAsistencia,
  FiltrosEstadisticas,
  RankingAlumnosAlertas,
  RankingFaltas,
  SerieDiaria,
  TiempoEnEscuela,
  TiempoResolucion,
  VitalesPorGrupo,
} from "@/types/estadisticas";
import { FilaRanking, TarjetaGrafico, TarjetaKpi, TituloSeccion } from "./tarjetas";

const COLOR_MARCA = "#575EAA";
const COLOR_PRESENTE = "#3B8C4A";
const COLOR_TARDANZA = "#B9790A";
const COLOR_AUSENTE = "#9A9AA0";

/** Paleta categórica para tipos de alerta — todos ya usados en el proyecto. */
const PALETA = [
  "#575EAA",
  "#E56363",
  "#F5A623",
  "#00ACC1",
  "#8E24AA",
  "#3CB878",
  "#FF7043",
];

const ESTILO_SELECTOR: React.CSSProperties = {
  border: "1px solid #3A3A3A",
  borderRadius: 25,
  height: 44,
  padding: "0 16px",
  fontSize: 15,
  background: "white",
  color: "#3A3A3A",
};

function hoyIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function hace7DiasIso(): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - 6);
  return fecha.toISOString().slice(0, 10);
}

function formatMinutos(minutos: number): string {
  if (minutos < 60) {
    return `${Math.round(minutos)} min`;
  }

  const horas = Math.floor(minutos / 60);
  const resto = Math.round(minutos % 60);
  return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`;
}

/**
 * Los formatters de recharts 3.x reciben `ValueType | undefined`, así que no
 * se les puede pasar una función que declare `number` directo.
 */
type ValorGrafico =
  | number
  | string
  | readonly (number | string)[]
  | undefined;

/** Formatter de tooltip: "<valor><sufijo>" con su etiqueta. */
function formatearValor(etiqueta: string, sufijo = "") {
  return (valor: ValorGrafico): [string, string] => [
    valor === undefined || valor === null ? "—" : `${String(valor)}${sufijo}`,
    etiqueta,
  ];
}

function formatearMinutosTooltip(valor: ValorGrafico): [string, string] {
  return [typeof valor === "number" ? formatMinutos(valor) : "—", "En escuela"];
}

function etiquetaDiaTooltip(label: React.ReactNode): React.ReactNode {
  return typeof label === "string" ? etiquetaDia(label) : label;
}

/** '2026-08-09' -> '09 ago' para los ejes, sin arrastrar zona horaria. */
function etiquetaDia(fecha: string): string {
  const [, mes, dia] = fecha.split("-");
  const meses = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
  ];
  return `${dia} ${meses[Number(mes) - 1] ?? ""}`;
}

interface DatosEstadisticas {
  asistencia: EstadisticasAsistencia;
  faltas: RankingFaltas[];
  alertasPorTipo: ConteoPorTipo[];
  alertasPorGrupo: ConteoPorGrupo[];
  alertasRanking: RankingAlumnosAlertas[];
  alertasPorSeveridad: ConteoPorSeveridad[];
  alertasSerie: SerieDiaria[];
  tiempoResolucion: TiempoResolucion;
  tiempoEnEscuela: TiempoEnEscuela;
  vitales: VitalesPorGrupo[];
}

interface EstadisticasPanelProps {
  grupos: GrupoMock[];
  onSalir: () => void;
}

/**
 * Pantalla de Estadísticas: reemplaza el contenido principal (mismo patrón
 * que AlertasPanel/ConfiguracionPanel). Los selectores de grupo y rango de
 * fechas controlan TODOS los gráficos a la vez — al cambiar cualquiera se
 * vuelven a pedir los 10 endpoints con los filtros nuevos.
 */
export function EstadisticasPanel({ grupos, onSalir }: EstadisticasPanelProps) {
  const [filtros, setFiltros] = useState<FiltrosEstadisticas>({
    grupoId: null,
    fechaInicio: hace7DiasIso(),
    fechaFin: hoyIso(),
  });
  const [datos, setDatos] = useState<DatosEstadisticas | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async (filtrosActuales: FiltrosEstadisticas) => {
    setCargando(true);

    try {
      const [
        asistencia,
        faltas,
        alertasPorTipo,
        alertasPorGrupo,
        alertasRanking,
        alertasPorSeveridad,
        alertasSerie,
        tiempoResolucion,
        tiempoEnEscuela,
        vitales,
      ] = await Promise.all([
        getEstadisticasAsistencia(filtrosActuales),
        getRankingFaltas(filtrosActuales),
        getAlertasPorTipo(filtrosActuales),
        getAlertasPorGrupo(filtrosActuales),
        getRankingAlumnosAlertas(filtrosActuales),
        getAlertasPorSeveridad(filtrosActuales),
        getAlertasSerieDiaria(filtrosActuales),
        getTiempoResolucionPromedio(filtrosActuales),
        getTiempoEnEscuela(filtrosActuales),
        getVitalesPromedioGrupo(filtrosActuales),
      ]);

      setDatos({
        asistencia,
        faltas,
        alertasPorTipo,
        alertasPorGrupo,
        alertasRanking,
        alertasPorSeveridad,
        alertasSerie,
        tiempoResolucion,
        tiempoEnEscuela,
        vitales,
      });
      setError(null);
    } catch {
      setError("No se pudieron cargar las estadísticas.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar(filtros);
  }, [cargar, filtros]);

  const donaAsistencia = useMemo(() => {
    if (!datos) return [];

    return [
      { nombre: "Presentes", valor: datos.asistencia.totales.presentes, color: COLOR_PRESENTE },
      { nombre: "Tardanzas", valor: datos.asistencia.totales.tardanzas, color: COLOR_TARDANZA },
      { nombre: "Ausentes", valor: datos.asistencia.totales.ausentes, color: COLOR_AUSENTE },
    ].filter((seccion) => seccion.valor > 0);
  }, [datos]);

  const totalAlertas = useMemo(
    () => datos?.alertasPorTipo.reduce((suma, fila) => suma + fila.total, 0) ?? 0,
    [datos],
  );

  return (
    <>
      <GrupoHeader titulo="ESTADÍSTICAS" />

      <div
        className="flex-1 overflow-hidden"
        style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
      >
        <div className="h-full bg-white overflow-hidden flex flex-col" style={{ borderRadius: 25 }}>
          <div
            className="shrink-0 flex items-center justify-between flex-wrap"
            style={{ padding: "28px clamp(20px, 3vw, 48px) 0", gap: 12 }}
          >
            <BotonAtras onClick={onSalir} />

            <div className="flex items-center flex-wrap" style={{ gap: 12 }}>
              <select
                value={filtros.grupoId ?? ""}
                onChange={(event) =>
                  setFiltros((previos) => ({
                    ...previos,
                    grupoId: event.target.value || null,
                  }))
                }
                style={ESTILO_SELECTOR}
                className="focus:outline-none"
                aria-label="Filtrar por grupo"
              >
                <option value="">Todos los grupos</option>
                {grupos.map((grupo) => (
                  <option key={grupo.id} value={grupo.id}>
                    {grupo.nombre}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={filtros.fechaInicio}
                max={filtros.fechaFin}
                onChange={(event) =>
                  setFiltros((previos) => ({
                    ...previos,
                    fechaInicio: event.target.value,
                  }))
                }
                style={ESTILO_SELECTOR}
                className="focus:outline-none"
                aria-label="Fecha de inicio del rango"
              />

              <input
                type="date"
                value={filtros.fechaFin}
                min={filtros.fechaInicio}
                onChange={(event) =>
                  setFiltros((previos) => ({
                    ...previos,
                    fechaFin: event.target.value,
                  }))
                }
                style={ESTILO_SELECTOR}
                className="focus:outline-none"
                aria-label="Fecha de fin del rango"
              />
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto flex flex-col"
            style={{ padding: "16px clamp(20px, 3vw, 48px) 40px", gap: 20 }}
          >
            {cargando && !datos && (
              <p className="text-[#8A8A8A]" style={{ fontSize: 16 }}>
                Cargando estadísticas...
              </p>
            )}

            {error && (
              <p className="text-[#E56363]" style={{ fontSize: 16 }}>
                {error}
              </p>
            )}

            {datos && !error && (
              <div
                className="flex flex-col"
                style={{ gap: 20, opacity: cargando ? 0.55 : 1, transition: "opacity 0.15s" }}
              >
                {/* ───────────── Sección 1: Asistencia ───────────── */}
                <TituloSeccion titulo="Asistencia" />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  <TarjetaKpi
                    etiqueta="Asistencia general del rango"
                    valor={`${datos.asistencia.totales.porcentajeAsistencia}%`}
                    detalle={`${datos.asistencia.rango.diasContados} días considerados`}
                  />
                  <TarjetaKpi
                    etiqueta="Registros de presente"
                    valor={String(datos.asistencia.totales.presentes)}
                    detalle={`${datos.asistencia.totales.tardanzas} con tardanza`}
                  />
                  <TarjetaKpi
                    etiqueta="Inasistencias acumuladas"
                    valor={String(datos.asistencia.totales.ausentes)}
                    detalle="Alumno-día sin registro"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
                  <TarjetaGrafico
                    titulo="Asistencia por grupo"
                    descripcion="¿Qué porcentaje de asistencia tuvo cada grupo en el rango?"
                    // Con cero asistencias el gráfico dibujaría ejes con
                    // barras invisibles, que no comunica nada — mejor decirlo.
                    vacio={
                      datos.asistencia.grupos.length === 0 ||
                      datos.asistencia.totales.presentes +
                        datos.asistencia.totales.tardanzas ===
                        0
                    }
                    mensajeVacio={
                      datos.asistencia.grupos.length === 0
                        ? "No hay grupos registrados"
                        : "Ningún registro de asistencia en este rango"
                    }
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={datos.asistencia.grupos}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E2E6" vertical={false} />
                        <XAxis
                          dataKey="grupoNombre"
                          tick={{ fontSize: 11, fill: "#8A8A8A" }}
                          interval={0}
                        />
                        <YAxis
                          unit="%"
                          domain={[0, 100]}
                          tick={{ fontSize: 11, fill: "#8A8A8A" }}
                        />
                        <Tooltip formatter={formatearValor("Asistencia", "%")} />
                        <Bar dataKey="porcentajeAsistencia" radius={[6, 6, 0, 0]}>
                          {datos.asistencia.grupos.map((grupo) => (
                            <Cell key={grupo.grupoId} fill={grupo.colorHex} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </TarjetaGrafico>

                  <TarjetaGrafico
                    titulo="Distribución de asistencia"
                    descripcion="¿Cómo se reparten presentes, tardanzas y ausencias?"
                    vacio={donaAsistencia.length === 0}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donaAsistencia}
                          dataKey="valor"
                          nameKey="nombre"
                          innerRadius="52%"
                          outerRadius="78%"
                          paddingAngle={2}
                        >
                          {donaAsistencia.map((seccion) => (
                            <Cell key={seccion.nombre} fill={seccion.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </TarjetaGrafico>
                </div>

                <TarjetaGrafico
                  titulo="Alumnos con más faltas"
                  descripcion="¿Quiénes acumularon más inasistencias en el rango? (top 10)"
                  vacio={datos.faltas.length === 0}
                  mensajeVacio="Ningún alumno registra faltas en este rango"
                  alto={datos.faltas.length > 0 ? Math.min(360, datos.faltas.length * 46 + 8) : 120}
                >
                  <div className="h-full overflow-y-auto flex flex-col" style={{ gap: 2 }}>
                    {datos.faltas.map((alumno, indice) => (
                      <FilaRanking
                        key={alumno.alumnoId}
                        posicion={indice + 1}
                        nombre={alumno.nombre}
                        subtitulo={alumno.grupoNombre}
                        valor={`${alumno.faltas} / ${alumno.diasContados}`}
                        proporcion={alumno.faltas / (datos.faltas[0]?.faltas || 1)}
                        color={COLOR_AUSENTE}
                      />
                    ))}
                  </div>
                </TarjetaGrafico>

                {/* ───────────── Sección 2: Alertas ───────────── */}
                <TituloSeccion titulo="Alertas" />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  <TarjetaKpi
                    etiqueta="Alertas generadas"
                    valor={String(totalAlertas)}
                    detalle="En el rango seleccionado"
                  />
                  <TarjetaKpi
                    etiqueta="Tiempo promedio de resolución"
                    valor={
                      datos.tiempoResolucion.minutosPromedio === null
                        ? "—"
                        : formatMinutos(datos.tiempoResolucion.minutosPromedio)
                    }
                    detalle={`${datos.tiempoResolucion.alertasResueltas} alertas resueltas`}
                  />
                  <TarjetaKpi
                    etiqueta="Alertas críticas"
                    valor={String(
                      datos.alertasPorSeveridad.find((fila) => fila.severidad === "PELIGRO")
                        ?.total ?? 0,
                    )}
                    detalle="Severidad PELIGRO"
                  />
                </div>

                <TarjetaGrafico
                  titulo="Alertas por día"
                  descripcion="¿Cómo evolucionó la cantidad de alertas a lo largo del rango?"
                  vacio={totalAlertas === 0}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={datos.alertasSerie}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E2E6" vertical={false} />
                      <XAxis
                        dataKey="fecha"
                        tickFormatter={etiquetaDia}
                        tick={{ fontSize: 11, fill: "#8A8A8A" }}
                      />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#8A8A8A" }} />
                      <Tooltip
                        labelFormatter={etiquetaDiaTooltip}
                        formatter={formatearValor("Alertas")}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke={COLOR_MARCA}
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TarjetaGrafico>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <TarjetaGrafico
                    titulo="Alertas por tipo"
                    descripcion="¿Qué tipo de incidente se repite más?"
                    vacio={datos.alertasPorTipo.length === 0}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={datos.alertasPorTipo.map((fila) => ({
                          ...fila,
                          etiqueta: ETIQUETA_ALERTA_TIPO[fila.tipo],
                        }))}
                        layout="vertical"
                        margin={{ left: 8, right: 12 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E2E6" horizontal={false} />
                        <XAxis
                          type="number"
                          allowDecimals={false}
                          tick={{ fontSize: 11, fill: "#8A8A8A" }}
                        />
                        <YAxis
                          type="category"
                          dataKey="etiqueta"
                          width={130}
                          tick={{ fontSize: 11, fill: "#8A8A8A" }}
                        />
                        <Tooltip formatter={formatearValor("Alertas")} />
                        <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                          {datos.alertasPorTipo.map((fila, indice) => (
                            <Cell key={fila.tipo} fill={PALETA[indice % PALETA.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </TarjetaGrafico>

                  <TarjetaGrafico
                    titulo="Alertas por severidad"
                    descripcion="¿Qué proporción de alertas fue crítica?"
                    vacio={datos.alertasPorSeveridad.length === 0}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={datos.alertasPorSeveridad}
                          dataKey="total"
                          nameKey="severidad"
                          innerRadius="52%"
                          outerRadius="78%"
                          paddingAngle={2}
                        >
                          {datos.alertasPorSeveridad.map((fila) => (
                            <Cell
                              key={fila.severidad}
                              fill={COLOR_ALERTA_SEVERIDAD[fila.severidad]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </TarjetaGrafico>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <TarjetaGrafico
                    titulo="Alertas por grupo"
                    descripcion="¿Qué grupo concentra más incidentes?"
                    vacio={datos.alertasPorGrupo.length === 0}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={datos.alertasPorGrupo}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E2E6" vertical={false} />
                        <XAxis
                          dataKey="grupoNombre"
                          tick={{ fontSize: 11, fill: "#8A8A8A" }}
                          interval={0}
                        />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#8A8A8A" }} />
                        <Tooltip formatter={formatearValor("Alertas")} />
                        <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                          {datos.alertasPorGrupo.map((fila, indice) => (
                            <Cell
                              key={fila.grupoId ?? `sin-grupo-${indice}`}
                              fill={fila.colorHex ?? COLOR_AUSENTE}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </TarjetaGrafico>

                  <TarjetaGrafico
                    titulo="Alumnos con más alertas"
                    descripcion="¿Quiénes generaron más alertas? (top 10)"
                    vacio={datos.alertasRanking.length === 0}
                  >
                    <div className="h-full overflow-y-auto flex flex-col" style={{ gap: 2 }}>
                      {datos.alertasRanking.map((alumno, indice) => (
                        <FilaRanking
                          key={alumno.alumnoId}
                          posicion={indice + 1}
                          nombre={alumno.nombre}
                          subtitulo={alumno.grupoNombre}
                          valor={String(alumno.total)}
                          proporcion={alumno.total / (datos.alertasRanking[0]?.total || 1)}
                          color="#E56363"
                        />
                      ))}
                    </div>
                  </TarjetaGrafico>
                </div>

                {/* ──────── Sección 3: Tiempo en escuela y vitales ──────── */}
                <TituloSeccion titulo="Tiempo en escuela y signos vitales" />

                <TarjetaGrafico
                  titulo={`Tiempo en escuela — ${etiquetaDia(datos.tiempoEnEscuela.fecha)}`}
                  descripcion="¿Cuánto tiempo estuvo cada alumno reportando telemetría ese día? (última fecha del rango)"
                  vacio={datos.tiempoEnEscuela.alumnos.length === 0}
                  mensajeVacio="Ninguna pulsera reportó telemetría ese día"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={datos.tiempoEnEscuela.alumnos}
                      layout="vertical"
                      margin={{ left: 8, right: 12 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E2E6" horizontal={false} />
                      <XAxis
                        type="number"
                        unit=" min"
                        tick={{ fontSize: 11, fill: "#8A8A8A" }}
                      />
                      <YAxis
                        type="category"
                        dataKey="nombre"
                        width={140}
                        tick={{ fontSize: 11, fill: "#8A8A8A" }}
                      />
                      <Tooltip
                        formatter={formatearMinutosTooltip}
                      />
                      <Bar dataKey="minutos" fill={COLOR_MARCA} radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TarjetaGrafico>

                <TarjetaGrafico
                  titulo="Promedio de signos vitales por grupo"
                  descripcion="¿Cómo se comparan pulso y temperatura promedio entre grupos? (se ignoran lecturas en cero del sensor)"
                  vacio={datos.vitales.length === 0}
                  mensajeVacio="Sin telemetría suficiente en este rango"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datos.vitales}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E2E6" vertical={false} />
                      <XAxis
                        dataKey="grupoNombre"
                        tick={{ fontSize: 11, fill: "#8A8A8A" }}
                        interval={0}
                      />
                      <YAxis
                        yAxisId="bpm"
                        tick={{ fontSize: 11, fill: "#8A8A8A" }}
                        label={{ value: "BPM", angle: -90, position: "insideLeft", fontSize: 11 }}
                      />
                      <YAxis
                        yAxisId="temp"
                        orientation="right"
                        domain={[30, 42]}
                        tick={{ fontSize: 11, fill: "#8A8A8A" }}
                        label={{ value: "°C", angle: 90, position: "insideRight", fontSize: 11 }}
                      />
                      <Tooltip />
                      <Bar
                        yAxisId="bpm"
                        dataKey="bpmPromedio"
                        name="Pulso promedio (BPM)"
                        fill={COLOR_MARCA}
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        yAxisId="temp"
                        dataKey="tempPromedio"
                        name="Temperatura promedio (°C)"
                        fill="#FF7043"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </TarjetaGrafico>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
