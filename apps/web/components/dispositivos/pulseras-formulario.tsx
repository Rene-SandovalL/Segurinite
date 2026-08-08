"use client";

import { useEffect, useState } from "react";
import {
  actualizarPulseraConfig,
  conectarPuertoPulsera,
  configurarMqttPulsera,
  configurarWifiPulsera,
  desconectarPuertoPulsera,
  getPulseras,
  leerConfigPulsera,
  listarPuertosPulsera,
  registrarPulsera,
  type PuertoSerial,
} from "@/lib/api/segurinite";
import type { PulseraMock } from "@/lib/mock/pulseras";
import type { EstadoPulsera } from "@/types/pulsera";
import { BotonAccion, CampoSelect, CampoTexto } from "./campo";

const ESTADOS: EstadoPulsera[] = ["DISPONIBLE", "CONECTADA", "REGISTRADA", "ASIGNADA"];

export function PulserasFormulario() {
  const [puertos, setPuertos] = useState<PuertoSerial[]>([]);
  const [puertoSeleccionado, setPuertoSeleccionado] = useState("");
  const [conectado, setConectado] = useState(false);
  const [cargandoSerial, setCargandoSerial] = useState(false);

  const [macLeida, setMacLeida] = useState("");
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [broker, setBroker] = useState("");
  const [puertoMqtt, setPuertoMqtt] = useState("");

  const [alias, setAlias] = useState("");
  const [pulseras, setPulseras] = useState<PulseraMock[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [estadoEdicion, setEstadoEdicion] = useState<EstadoPulsera>("DISPONIBLE");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; error?: boolean } | null>(null);

  useEffect(() => {
    void getPulseras().then(setPulseras);
  }, []);

  const recargarPulseras = async () => {
    setPulseras(await getPulseras());
  };

  const buscarPuertos = async () => {
    setCargandoSerial(true);
    try {
      setPuertos(await listarPuertosPulsera());
    } catch {
      setMensaje({ texto: "No se pudieron listar los puertos seriales.", error: true });
    } finally {
      setCargandoSerial(false);
    }
  };

  const conectar = async () => {
    if (!puertoSeleccionado) return;
    setCargandoSerial(true);
    try {
      await conectarPuertoPulsera(puertoSeleccionado);
      setConectado(true);
      setMensaje({ texto: `Conectado a ${puertoSeleccionado}` });
    } catch {
      setMensaje({ texto: "No se pudo conectar con la pulsera.", error: true });
    } finally {
      setCargandoSerial(false);
    }
  };

  const desconectar = async () => {
    await desconectarPuertoPulsera().catch(() => undefined);
    setConectado(false);
  };

  const leerConfig = async () => {
    setCargandoSerial(true);
    try {
      const config = await leerConfigPulsera();
      setMacLeida(config.mac);
      setSsid(config.ssid);
      setBroker(config.broker);
      setPuertoMqtt(config.port ? String(config.port) : "");
      setMensaje({ texto: "Configuración leída desde la pulsera." });
    } catch {
      setMensaje({ texto: "No se pudo leer la configuración de la pulsera.", error: true });
    } finally {
      setCargandoSerial(false);
    }
  };

  const guardarWifi = async () => {
    if (!ssid || !password) {
      setMensaje({ texto: "Completa SSID y contraseña.", error: true });
      return;
    }

    setCargandoSerial(true);
    try {
      const resultado = await configurarWifiPulsera(ssid, password);
      setMensaje(
        resultado.ok ? { texto: "WiFi configurado en la pulsera." } : { texto: `Respuesta: ${resultado.raw}`, error: true },
      );
    } catch {
      setMensaje({ texto: "No se pudo configurar el WiFi.", error: true });
    } finally {
      setCargandoSerial(false);
    }
  };

  const guardarMqtt = async () => {
    const puertoNumerico = Number(puertoMqtt);
    if (!broker || !Number.isInteger(puertoNumerico)) {
      setMensaje({ texto: "Completa broker y puerto MQTT válidos.", error: true });
      return;
    }

    setCargandoSerial(true);
    try {
      const resultado = await configurarMqttPulsera(broker, puertoNumerico);
      setMensaje(
        resultado.ok ? { texto: "MQTT configurado en la pulsera." } : { texto: `Respuesta: ${resultado.raw}`, error: true },
      );
    } catch {
      setMensaje({ texto: "No se pudo configurar el MQTT.", error: true });
    } finally {
      setCargandoSerial(false);
    }
  };

  const registrar = async () => {
    if (!macLeida) {
      setMensaje({ texto: "Lee la configuración de la pulsera para obtener su MAC.", error: true });
      return;
    }

    setGuardando(true);
    try {
      await registrarPulsera({ macAddress: macLeida, alias: alias.trim() || undefined });
      setMensaje({ texto: "Pulsera registrada correctamente." });
      setAlias("");
      await recargarPulseras();
    } catch (error) {
      const texto = error instanceof Error ? error.message : "No se pudo registrar la pulsera.";
      setMensaje({ texto, error: true });
    } finally {
      setGuardando(false);
    }
  };

  const cargarEnEdicion = (pulsera: PulseraMock) => {
    setEditandoId(pulsera.id);
    setAlias(pulsera.alias ?? "");
    setEstadoEdicion(pulsera.estado);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setAlias("");
  };

  const guardarEdicion = async () => {
    if (editandoId === null) return;

    setGuardando(true);
    try {
      await actualizarPulseraConfig(editandoId, {
        alias: alias.trim() || undefined,
        estado: estadoEdicion,
      });
      setMensaje({ texto: "Pulsera actualizada correctamente." });
      cancelarEdicion();
      await recargarPulseras();
    } catch (error) {
      const texto = error instanceof Error ? error.message : "No se pudo actualizar la pulsera.";
      setMensaje({ texto, error: true });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ padding: "16px clamp(20px, 3vw, 48px) 40px", gap: 28 }}>
      {/* Conexión serial */}
      <section className="flex flex-col gap-3">
        <span className="font-normal text-[#3A3A3A]" style={{ fontSize: "clamp(18px, 2vw, 26px)" }}>
          Conexión serial
        </span>

        <div className="flex flex-wrap items-end gap-3">
          <div style={{ minWidth: 240 }}>
            <CampoSelect
              label="Puerto"
              valor={puertoSeleccionado}
              onChange={setPuertoSeleccionado}
              placeholder="Selecciona un puerto"
              opciones={puertos.map((p) => ({ value: p.path, label: p.path }))}
            />
          </div>

          <BotonAccion label="Buscar puertos" variant="secundario" onClick={() => void buscarPuertos()} disabled={cargandoSerial} />

          {conectado ? (
            <BotonAccion label="Desconectar" variant="secundario" onClick={() => void desconectar()} disabled={cargandoSerial} />
          ) : (
            <BotonAccion label="Conectar" onClick={() => void conectar()} disabled={cargandoSerial || !puertoSeleccionado} />
          )}

          <BotonAccion label="Leer config actual" variant="secundario" onClick={() => void leerConfig()} disabled={!conectado || cargandoSerial} />
        </div>
      </section>

      {/* WiFi / MQTT */}
      <section className="flex flex-col gap-3">
        <span className="font-normal text-[#3A3A3A]" style={{ fontSize: "clamp(18px, 2vw, 26px)" }}>
          WiFi y MQTT
        </span>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <CampoTexto label="SSID" valor={ssid} onChange={setSsid} />
          <CampoTexto label="Contraseña WiFi" valor={password} onChange={setPassword} tipo="password" />
          <CampoTexto label="Broker MQTT" valor={broker} onChange={setBroker} />
          <CampoTexto label="Puerto MQTT" valor={puertoMqtt} onChange={setPuertoMqtt} tipo="number" />
        </div>

        <div className="flex items-center gap-3">
          <BotonAccion label="Guardar WiFi" variant="secundario" onClick={() => void guardarWifi()} disabled={!conectado || cargandoSerial} />
          <BotonAccion label="Guardar MQTT" variant="secundario" onClick={() => void guardarMqtt()} disabled={!conectado || cargandoSerial} />
        </div>
      </section>

      {/* Registro en base de datos */}
      <section className="flex flex-col gap-3">
        <span className="font-normal text-[#3A3A3A]" style={{ fontSize: "clamp(18px, 2vw, 26px)" }}>
          Registrar pulsera
        </span>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <CampoTexto label="MAC address" valor={macLeida} onChange={setMacLeida} placeholder="AA:BB:CC:DD:EE:FF" />
          <CampoTexto label="Alias (opcional)" valor={alias} onChange={setAlias} />
        </div>

        <div>
          <BotonAccion label={guardando ? "Guardando..." : "Registrar pulsera"} onClick={() => void registrar()} disabled={guardando} />
        </div>

        {mensaje && (
          <span style={{ color: mensaje.error ? "#E66363" : "#3CB878", fontSize: 15 }}>{mensaje.texto}</span>
        )}
      </section>

      {/* Tabla de pulseras registradas */}
      <section className="flex flex-col gap-3">
        <span className="font-normal text-[#3A3A3A]" style={{ fontSize: "clamp(18px, 2vw, 26px)" }}>
          Pulseras registradas
        </span>

        <div className="flex flex-col gap-2">
          {pulseras.length === 0 && (
            <p className="text-[#8A8A8A]" style={{ fontSize: 15 }}>Aún no hay pulseras registradas.</p>
          )}

          {pulseras.map((pulsera) => {
            const enEdicion = editandoId === pulsera.id;

            return (
              <div
                key={pulsera.id}
                className="flex flex-col"
                style={{
                  background: "#3A3A3A",
                  borderRadius: 22,
                  border: "4px solid #575EAA",
                  padding: "10px 20px",
                  gap: 10,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col text-white">
                    <span style={{ fontSize: 16 }}>{pulsera.alias ?? "Sin alias"}</span>
                    <span style={{ fontSize: 13, color: "#B8B8B8" }}>
                      {pulsera.macAddress ?? pulsera.uuid} · {pulsera.estado}
                    </span>
                  </div>

                  {!enEdicion && (
                    <BotonAccion label="Editar" variant="secundario" onClick={() => cargarEnEdicion(pulsera)} />
                  )}
                </div>

                {enEdicion && (
                  <div className="flex flex-wrap items-end gap-3">
                    <CampoTexto label="Alias" valor={alias} onChange={setAlias} />
                    <CampoSelect
                      label="Estado"
                      valor={estadoEdicion}
                      onChange={(v) => setEstadoEdicion(v as EstadoPulsera)}
                      opciones={ESTADOS.map((e) => ({ value: e, label: e }))}
                    />
                    <BotonAccion label="Guardar" onClick={() => void guardarEdicion()} disabled={guardando} />
                    <BotonAccion label="Cancelar" variant="secundario" onClick={cancelarEdicion} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
