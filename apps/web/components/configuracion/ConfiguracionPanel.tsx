"use client";

import { useEffect, useState } from "react";
import { GrupoHeader } from "@/components/grupos/grupo-header";
import { BotonAtras } from "@/components/ui/boton-atras";
import { ToastNotificacion, type ToastData } from "@/components/ui/toast";
import {
  actualizarConfiguracionAlertas,
  actualizarConfiguracionHorario,
  getConfiguracionAlertas,
  getConfiguracionHorario,
} from "@/lib/api/segurinite";
import type {
  ConfiguracionAlertas,
  ConfiguracionHorario,
} from "@/types/configuracion";

interface ConfiguracionPanelProps {
  onSalir: () => void;
}

const estiloInput: React.CSSProperties = {
  border: "1px solid #3A3A3A",
  borderRadius: 22,
  height: 44,
  padding: "0 16px",
  fontSize: 15,
  color: "#3A3A3A",
  background: "white",
  textAlign: "center",
};

function TarjetaAgrupada({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col"
      style={{
        background: "var(--color-card-agrupada)",
        border: "1px solid var(--color-borde)",
        borderRadius: 25,
        padding: "clamp(20px, 2.5vw, 32px)",
      }}
    >
      <span
        className="text-[#3A3A3A] font-normal"
        style={{ fontSize: "clamp(20px, 2.2vw, 26px)", marginBottom: 8 }}
      >
        {titulo}
      </span>
      {children}
    </div>
  );
}

function Fila({
  label,
  descripcion,
  children,
}: {
  label: string;
  descripcion?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between gap-6"
      style={{ padding: "14px 0", borderTop: "1px solid #E2E2E6" }}
    >
      <div className="flex flex-col" style={{ gap: 2, maxWidth: 460 }}>
        <span className="text-[#3A3A3A] font-normal" style={{ fontSize: 16 }}>
          {label}
        </span>
        {descripcion && (
          <span className="text-[#8A8A8A]" style={{ fontSize: 13 }}>
            {descripcion}
          </span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function InputHora({
  valor,
  onChange,
}: {
  valor: string;
  onChange: (valor: string) => void;
}) {
  return (
    <input
      type="time"
      value={valor}
      onChange={(event) => onChange(event.target.value)}
      className="focus:outline-none"
      style={{ ...estiloInput, width: 130 }}
    />
  );
}

function InputNumero({
  valor,
  onChange,
  min,
  step = 1,
  sufijo,
  ancho = 90,
}: {
  valor: number;
  onChange: (valor: number) => void;
  min?: number;
  step?: number;
  sufijo?: string;
  ancho?: number;
}) {
  return (
    <div className="flex items-center" style={{ gap: 8 }}>
      <input
        type="number"
        value={Number.isNaN(valor) ? "" : valor}
        min={min}
        step={step}
        onChange={(event) => {
          const nuevoValor = event.target.valueAsNumber;
          onChange(Number.isNaN(nuevoValor) ? 0 : nuevoValor);
        }}
        className="focus:outline-none"
        style={{ ...estiloInput, width: ancho }}
      />
      {sufijo && (
        <span className="text-[#8A8A8A]" style={{ fontSize: 14 }}>
          {sufijo}
        </span>
      )}
    </div>
  );
}

function BotonGuardar({
  guardando,
  onClick,
}: {
  guardando: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={guardando}
      className="border-none cursor-pointer font-normal text-[#3A3A3A] focus:outline-none"
      style={{
        background: guardando ? "#B8DDB1" : "#87D67B",
        borderRadius: 25,
        height: 48,
        padding: "0 32px",
        fontSize: 16,
        boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
        opacity: guardando ? 0.9 : 1,
        marginTop: 20,
      }}
    >
      {guardando ? "Guardando..." : "Guardar cambios"}
    </button>
  );
}

interface SeccionHorarioProps {
  config: ConfiguracionHorario;
  onGuardado: (config: ConfiguracionHorario) => void;
  mostrarToast: (toast: ToastData) => void;
}

function SeccionHorario({
  config,
  onGuardado,
  mostrarToast,
}: SeccionHorarioProps) {
  const [horaEntrada, setHoraEntrada] = useState(config.horaEntrada);
  const [horaSalida, setHoraSalida] = useState(config.horaSalida);
  const [tolerancia, setTolerancia] = useState(
    config.toleranciaTardanzaMinutos,
  );
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardar = async () => {
    setError(null);

    if (!horaEntrada || !horaSalida) {
      setError("Hora de entrada y salida son obligatorias.");
      return;
    }

    if (horaEntrada >= horaSalida) {
      setError("La hora de entrada debe ser anterior a la hora de salida.");
      return;
    }

    setGuardando(true);

    try {
      const actualizado = await actualizarConfiguracionHorario({
        horaEntrada,
        horaSalida,
        toleranciaTardanzaMinutos: tolerancia,
      });
      onGuardado(actualizado);
      mostrarToast({ mensaje: "Horario escolar actualizado", color: "#87D67B" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar el horario.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <TarjetaAgrupada titulo="Horario escolar">
      <Fila label="Hora de entrada" descripcion="Inicio de clases">
        <InputHora valor={horaEntrada} onChange={setHoraEntrada} />
      </Fila>
      <Fila label="Hora de salida" descripcion="Fin de clases">
        <InputHora valor={horaSalida} onChange={setHoraSalida} />
      </Fila>
      <Fila
        label="Tolerancia de tardanza"
        descripcion="Minutos después de la hora de entrada antes de marcar tardanza en vez de presente"
      >
        <InputNumero
          valor={tolerancia}
          onChange={setTolerancia}
          min={0}
          sufijo="min"
        />
      </Fila>

      {error && (
        <p className="text-[#E56363]" style={{ marginTop: 12, fontSize: 14 }}>
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <BotonGuardar guardando={guardando} onClick={() => void guardar()} />
      </div>
    </TarjetaAgrupada>
  );
}

interface SeccionAlertasProps {
  config: ConfiguracionAlertas;
  onGuardado: (config: ConfiguracionAlertas) => void;
  mostrarToast: (toast: ToastData) => void;
}

function SeccionAlertas({
  config,
  onGuardado,
  mostrarToast,
}: SeccionAlertasProps) {
  const [tempAlertaMin, setTempAlertaMin] = useState(config.tempAlertaMin);
  const [tempNormalMin, setTempNormalMin] = useState(config.tempNormalMin);
  const [tempNormalMax, setTempNormalMax] = useState(config.tempNormalMax);
  const [tempAlertaMax, setTempAlertaMax] = useState(config.tempAlertaMax);
  const [bpmAlto, setBpmAlto] = useState(config.bpmAlto);
  const [contadorTemp, setContadorTemp] = useState(config.contadorTemp);
  const [contadorVitalCero, setContadorVitalCero] = useState(
    config.contadorVitalCero,
  );
  const [contadorFueraZona, setContadorFueraZona] = useState(
    config.contadorFueraZona,
  );
  const [sinSenalSegundos, setSinSenalSegundos] = useState(
    config.sinSenalSegundos,
  );
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardar = async () => {
    setError(null);

    const ordenValido =
      tempAlertaMin < tempNormalMin &&
      tempNormalMin < tempNormalMax &&
      tempNormalMax < tempAlertaMax;

    if (!ordenValido) {
      setError(
        "Los umbrales de temperatura deben cumplir: mínima crítica < mínima normal < máxima normal < máxima crítica.",
      );
      return;
    }

    setGuardando(true);

    try {
      const actualizado = await actualizarConfiguracionAlertas({
        tempAlertaMin,
        tempNormalMin,
        tempNormalMax,
        tempAlertaMax,
        bpmAlto,
        contadorTemp,
        contadorVitalCero,
        contadorFueraZona,
        sinSenalSegundos,
      });
      onGuardado(actualizado);
      mostrarToast({ mensaje: "Umbrales de alerta actualizados", color: "#87D67B" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron guardar los umbrales de alerta.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <TarjetaAgrupada titulo="Umbrales de alerta">
      <Fila
        label="Temperatura mínima crítica (°C)"
        descripcion="Por debajo de este valor se genera una alerta de PELIGRO"
      >
        <InputNumero
          valor={tempAlertaMin}
          onChange={setTempAlertaMin}
          step={0.1}
        />
      </Fila>
      <Fila
        label="Temperatura mínima normal (°C)"
        descripcion="Entre este valor y la mínima crítica se genera una ALERTA"
      >
        <InputNumero
          valor={tempNormalMin}
          onChange={setTempNormalMin}
          step={0.1}
        />
      </Fila>
      <Fila
        label="Temperatura máxima normal (°C)"
        descripcion="Entre este valor y la máxima crítica se genera una ALERTA"
      >
        <InputNumero
          valor={tempNormalMax}
          onChange={setTempNormalMax}
          step={0.1}
        />
      </Fila>
      <Fila
        label="Temperatura máxima crítica (°C)"
        descripcion="Por encima de este valor se genera una alerta de PELIGRO"
      >
        <InputNumero
          valor={tempAlertaMax}
          onChange={setTempAlertaMax}
          step={0.1}
        />
      </Fila>
      <Fila
        label="Pulso alto (BPM)"
        descripcion="Por encima de este valor se considera pulso elevado"
      >
        <InputNumero valor={bpmAlto} onChange={setBpmAlto} min={1} />
      </Fila>
      <Fila
        label="Lecturas antes de alertar por temperatura"
        descripcion="Cuántas lecturas seguidas fuera de rango antes de crear la alerta"
      >
        <InputNumero
          valor={contadorTemp}
          onChange={setContadorTemp}
          min={1}
        />
      </Fila>
      <Fila
        label="Lecturas antes de alertar por signos vitales en cero"
        descripcion="También controla la racha de pulso alto"
      >
        <InputNumero
          valor={contadorVitalCero}
          onChange={setContadorVitalCero}
          min={1}
        />
      </Fila>
      <Fila
        label="Lecturas antes de alertar por salida de zona"
        descripcion="Cuántas lecturas seguidas fuera de cobertura antes de crear la alerta"
      >
        <InputNumero
          valor={contadorFueraZona}
          onChange={setContadorFueraZona}
          min={1}
        />
      </Fila>
      <Fila
        label="Segundos sin señal antes de alertar"
        descripcion="Tiempo sin reportar telemetría antes de la alerta de SIN SEÑAL"
      >
        <InputNumero
          valor={sinSenalSegundos}
          onChange={setSinSenalSegundos}
          min={1}
          sufijo="seg"
        />
      </Fila>

      {error && (
        <p className="text-[#E56363]" style={{ marginTop: 12, fontSize: 14 }}>
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <BotonGuardar guardando={guardando} onClick={() => void guardar()} />
      </div>
    </TarjetaAgrupada>
  );
}

/**
 * Reemplaza el contenido principal con la pantalla de configuración general:
 * horario escolar y umbrales de alerta, cada uno en su propia tarjeta con su
 * propio botón de guardar — mismo patrón de panel de pantalla completa que
 * AlertasPanel/DispositivosPanel.
 */
export function ConfiguracionPanel({ onSalir }: ConfiguracionPanelProps) {
  const [horario, setHorario] = useState<ConfiguracionHorario | null>(null);
  const [alertas, setAlertas] = useState<ConfiguracionAlertas | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [configHorario, configAlertas] = await Promise.all([
          getConfiguracionHorario(),
          getConfiguracionAlertas(),
        ]);
        setHorario(configHorario);
        setAlertas(configAlertas);
        setError(null);
      } catch {
        setError("No se pudo cargar la configuración.");
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  return (
    <>
      <GrupoHeader titulo="CONFIGURACIÓN" />

      <div
        className="flex-1 overflow-hidden"
        style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
      >
        <div className="h-full bg-white overflow-hidden flex flex-col" style={{ borderRadius: 25 }}>
          <div className="shrink-0" style={{ padding: "28px 0 0 28px" }}>
            <BotonAtras onClick={onSalir} />
          </div>

          <div
            className="flex-1 overflow-y-auto flex flex-col"
            style={{ padding: "16px clamp(20px, 3vw, 48px) 40px", gap: 24 }}
          >
            {cargando && (
              <p className="text-[#8A8A8A]" style={{ fontSize: 16 }}>
                Cargando configuración...
              </p>
            )}

            {error && (
              <p className="text-[#E56363]" style={{ fontSize: 16 }}>
                {error}
              </p>
            )}

            {!cargando && !error && horario && alertas && (
              <>
                <SeccionHorario
                  config={horario}
                  onGuardado={setHorario}
                  mostrarToast={setToast}
                />
                <SeccionAlertas
                  config={alertas}
                  onGuardado={setAlertas}
                  mostrarToast={setToast}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {toast && <ToastNotificacion {...toast} onDismiss={() => setToast(null)} />}
    </>
  );
}
