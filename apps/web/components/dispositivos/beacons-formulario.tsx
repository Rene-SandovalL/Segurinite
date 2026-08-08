"use client";

import { useEffect, useState } from "react";
import {
  actualizarBeaconConfig,
  asignarIdBeacon,
  conectarPuertoBeacon,
  desconectarPuertoBeacon,
  getBeacons,
  getColores,
  getMapas,
  getZonas,
  leerIdBeacon,
  listarPuertosBeacon,
  registrarBeacon,
  type PuertoSerial,
} from "@/lib/api/segurinite";
import type { BeaconMock } from "@/lib/mock/beacons";
import type { ColorGrupoDisponible } from "@/lib/api/segurinite";
import type { MapaMock } from "@/lib/mock/mapas";
import type { ZonaMock } from "@/lib/mock/zonas";
import { BotonAccion, CampoSelect, CampoTexto } from "./campo";

interface FormularioBeaconState {
  beaconId: string;
  zonaId: string;
  colorId: string;
  mapaId: string;
  nombre: string;
  macAddress: string;
}

const ESTADO_INICIAL: FormularioBeaconState = {
  beaconId: "",
  zonaId: "",
  colorId: "",
  mapaId: "",
  nombre: "",
  macAddress: "",
};

export function BeaconsFormulario() {
  const [puertos, setPuertos] = useState<PuertoSerial[]>([]);
  const [puertoSeleccionado, setPuertoSeleccionado] = useState("");
  const [conectado, setConectado] = useState(false);
  const [cargandoSerial, setCargandoSerial] = useState(false);

  const [colores, setColores] = useState<ColorGrupoDisponible[]>([]);
  const [zonas, setZonas] = useState<ZonaMock[]>([]);
  const [mapas, setMapas] = useState<MapaMock[]>([]);
  const [beacons, setBeacons] = useState<BeaconMock[]>([]);

  const [form, setForm] = useState<FormularioBeaconState>(ESTADO_INICIAL);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; error?: boolean } | null>(null);

  useEffect(() => {
    void Promise.all([getColores(), getZonas(), getMapas(), getBeacons()]).then(
      ([coloresRes, zonasRes, mapasRes, beaconsRes]) => {
        setColores(coloresRes);
        setZonas(zonasRes);
        setMapas(mapasRes);
        setBeacons(beaconsRes);
      },
    );
  }, []);

  const recargarBeacons = async () => {
    setBeacons(await getBeacons());
  };

  const buscarPuertos = async () => {
    setCargandoSerial(true);
    try {
      setPuertos(await listarPuertosBeacon());
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
      await conectarPuertoBeacon(puertoSeleccionado);
      setConectado(true);
      setMensaje({ texto: `Conectado a ${puertoSeleccionado}` });
    } catch {
      setMensaje({ texto: "No se pudo conectar con el beacon.", error: true });
    } finally {
      setCargandoSerial(false);
    }
  };

  const desconectar = async () => {
    await desconectarPuertoBeacon().catch(() => undefined);
    setConectado(false);
  };

  const leerId = async () => {
    setCargandoSerial(true);
    try {
      const resultado = await leerIdBeacon();
      if (resultado.id !== null) {
        setForm((prev) => ({ ...prev, beaconId: String(resultado.id) }));
        setMensaje({ texto: `ID leído: ${resultado.id}` });
      } else {
        setMensaje({ texto: "El beacon no respondió con un ID válido.", error: true });
      }
    } catch {
      setMensaje({ texto: "No se pudo leer el ID del beacon.", error: true });
    } finally {
      setCargandoSerial(false);
    }
  };

  const asignarId = async () => {
    const idNumerico = Number(form.beaconId);
    if (!Number.isInteger(idNumerico)) {
      setMensaje({ texto: "Ingresa un ID numérico válido.", error: true });
      return;
    }

    setCargandoSerial(true);
    try {
      const resultado = await asignarIdBeacon(idNumerico);
      setMensaje(
        resultado.ok
          ? { texto: `ID ${idNumerico} asignado al beacon.` }
          : { texto: `El beacon respondió: ${resultado.raw}`, error: true },
      );
    } catch {
      setMensaje({ texto: "No se pudo asignar el ID al beacon.", error: true });
    } finally {
      setCargandoSerial(false);
    }
  };

  const cargarEnFormulario = (beacon: BeaconMock) => {
    setEditandoId(beacon.id);
    setForm({
      beaconId: String(beacon.beaconId),
      zonaId: beacon.zonaId ? String(beacon.zonaId) : "",
      colorId: beacon.color ? String(beacon.color.id) : "",
      mapaId: beacon.mapaId ? String(beacon.mapaId) : "",
      nombre: beacon.nombre ?? "",
      macAddress: beacon.macAddress ?? "",
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm(ESTADO_INICIAL);
  };

  const guardar = async () => {
    if (!form.zonaId) {
      setMensaje({ texto: "Selecciona una zona para el beacon.", error: true });
      return;
    }

    if (!form.beaconId) {
      setMensaje({ texto: "Falta el ID del beacon.", error: true });
      return;
    }

    setGuardando(true);
    try {
      if (editandoId !== null) {
        await actualizarBeaconConfig(editandoId, {
          nombre: form.nombre.trim() || undefined,
          colorId: form.colorId ? Number(form.colorId) : undefined,
          zonaId: Number(form.zonaId),
          mapaId: form.mapaId ? Number(form.mapaId) : undefined,
        });
      } else {
        await registrarBeacon({
          beaconId: Number(form.beaconId),
          zonaId: Number(form.zonaId),
          nombre: form.nombre.trim() || undefined,
          colorId: form.colorId ? Number(form.colorId) : undefined,
          mapaId: form.mapaId ? Number(form.mapaId) : undefined,
          macAddress: form.macAddress.trim() || undefined,
        });
      }

      setMensaje({ texto: "Beacon guardado correctamente." });
      cancelarEdicion();
      await recargarBeacons();
    } catch (error) {
      const texto = error instanceof Error ? error.message : "No se pudo guardar el beacon.";
      setMensaje({ texto, error: true });
    } finally {
      setGuardando(false);
    }
  };

  const nombreZona = (zonaId: number) => zonas.find((z) => z.id === zonaId)?.nombre ?? `Zona ${zonaId}`;
  const nombreMapa = (mapaId: number | null) => mapas.find((m) => m.id === mapaId)?.nombre ?? "—";

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

          <BotonAccion label="Leer ID actual" variant="secundario" onClick={() => void leerId()} disabled={!conectado || cargandoSerial} />
          <BotonAccion label="Asignar ID" onClick={() => void asignarId()} disabled={!conectado || cargandoSerial || !form.beaconId} />
        </div>
      </section>

      {/* Formulario de registro/edición */}
      <section className="flex flex-col gap-3">
        <span className="font-normal text-[#3A3A3A]" style={{ fontSize: "clamp(18px, 2vw, 26px)" }}>
          {editandoId !== null ? "Editar beacon" : "Registrar beacon"}
        </span>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <CampoTexto
            label="Beacon ID"
            valor={form.beaconId}
            onChange={(v) => setForm((p) => ({ ...p, beaconId: v }))}
            tipo="number"
            disabled={editandoId !== null}
          />
          <CampoSelect
            label="Zona"
            valor={form.zonaId}
            onChange={(v) => setForm((p) => ({ ...p, zonaId: v }))}
            opciones={zonas.map((z) => ({ value: String(z.id), label: z.nombre }))}
          />
          <CampoSelect
            label="Color"
            valor={form.colorId}
            onChange={(v) => setForm((p) => ({ ...p, colorId: v }))}
            opciones={colores.map((c) => ({ value: String(c.id), label: c.nombre ?? c.valorHex }))}
          />
          <CampoSelect
            label="Mapa (opcional)"
            valor={form.mapaId}
            onChange={(v) => setForm((p) => ({ ...p, mapaId: v }))}
            opciones={mapas.map((m) => ({ value: String(m.id), label: m.nombre }))}
          />
          <CampoTexto label="Nombre" valor={form.nombre} onChange={(v) => setForm((p) => ({ ...p, nombre: v }))} />
          <CampoTexto
            label="MAC address (opcional)"
            valor={form.macAddress}
            onChange={(v) => setForm((p) => ({ ...p, macAddress: v }))}
            placeholder="AA:BB:CC:DD:EE:FF"
            disabled={editandoId !== null}
          />
        </div>

        <div className="flex items-center gap-3">
          <BotonAccion label={guardando ? "Guardando..." : "Guardar"} onClick={() => void guardar()} disabled={guardando} />
          {editandoId !== null && <BotonAccion label="Cancelar" variant="secundario" onClick={cancelarEdicion} />}
        </div>

        {mensaje && (
          <span style={{ color: mensaje.error ? "#E66363" : "#3CB878", fontSize: 15 }}>{mensaje.texto}</span>
        )}
      </section>

      {/* Tabla de beacons registrados */}
      <section className="flex flex-col gap-3">
        <span className="font-normal text-[#3A3A3A]" style={{ fontSize: "clamp(18px, 2vw, 26px)" }}>
          Beacons registrados
        </span>

        <div className="flex flex-col gap-2">
          {beacons.length === 0 && (
            <p className="text-[#8A8A8A]" style={{ fontSize: 15 }}>Aún no hay beacons registrados.</p>
          )}

          {beacons.map((beacon) => (
            <div
              key={beacon.id}
              className="flex items-center justify-between"
              style={{
                background: "#3A3A3A",
                borderRadius: 22,
                border: `4px solid ${beacon.color?.valorHex ?? "#575EAA"}`,
                padding: "10px 20px",
              }}
            >
              <div className="flex flex-col text-white">
                <span style={{ fontSize: 16 }}>
                  #{beacon.beaconId} — {beacon.nombre ?? "Sin nombre"}
                </span>
                <span style={{ fontSize: 13, color: "#B8B8B8" }}>
                  {nombreZona(beacon.zonaId)} · {nombreMapa(beacon.mapaId)}
                </span>
              </div>

              <BotonAccion label="Editar" variant="secundario" onClick={() => cargarEnFormulario(beacon)} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
