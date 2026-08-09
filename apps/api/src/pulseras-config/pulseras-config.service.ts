import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ReadlineParser, SerialPort } from 'serialport';

const BAUD_RATE = 115200;
const TIMEOUT_MS = 12000;

export interface PuertoSerialInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  vendorId?: string;
  productId?: string;
}

export interface PulseraConfigSerial {
  ssid: string;
  broker: string;
  port?: number;
  mac: string;
}

/**
 * Comunicación serial (USB) con una pulsera ESP32 en modo configuración.
 * Protocolo de línea: GET_CONFIG -> "CONFIG:ssid=...;broker=...;port=...;mac=...",
 * SET_WIFI:<ssid>|<password>, SET_MQTT:<broker>|<port>.
 * Timeout más largo que el de beacons: el device bloquea la respuesta mientras
 * intenta (re)conectarse de verdad (hasta ~10s en WiFi).
 * Puerto adaptado del bridge de referencia beacon-config-backend/src/device-config.
 */
interface PendingRequest {
  prefijos: string[];
  resolve: (line: string) => void;
}

@Injectable()
export class PulseraSerialService implements OnModuleDestroy {
  private port: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private pendingRequest: PendingRequest | null = null;

  async listPorts(): Promise<PuertoSerialInfo[]> {
    return SerialPort.list();
  }

  async connect(path: string): Promise<{ connected: boolean; path: string }> {
    if (this.port?.isOpen) {
      await this.disconnect();
    }

    this.port = new SerialPort({ path, baudRate: BAUD_RATE });
    this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));

    this.parser.on('data', (raw: string) => {
      const line = raw.trim();

      // El firmware imprime logs de diagnóstico ([stage], [scan], status de
      // BPM/SpO2/Area, etc.) constantemente en su loop(), sin relación con el
      // comando en curso. Solo una línea con el prefijo esperado por el
      // comando pendiente cuenta como su respuesta; cualquier otra se
      // descarta silenciosamente y se sigue esperando.
      if (
        this.pendingRequest &&
        this.pendingRequest.prefijos.some((prefijo) => line.startsWith(prefijo))
      ) {
        const { resolve } = this.pendingRequest;
        this.pendingRequest = null;
        resolve(line);
      }
    });

    await new Promise<void>((resolve, reject) => {
      this.port!.on('open', () => resolve());
      this.port!.on('error', (err) => reject(err));
    });

    return { connected: true, path };
  }

  async disconnect(): Promise<{ connected: boolean }> {
    if (this.port?.isOpen) {
      await new Promise<void>((resolve) => this.port!.close(() => resolve()));
    }
    this.port = null;
    this.parser = null;
    return { connected: false };
  }

  isConnected(): boolean {
    return !!this.port?.isOpen;
  }

  private sendCommand(
    command: string,
    prefijosEsperados: string[],
    timeoutMs = TIMEOUT_MS,
  ): Promise<string> {
    if (!this.port || !this.port.isOpen) {
      return Promise.reject(new Error('No hay conexión con la pulsera'));
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequest = null;
        reject(
          new Error(
            'Tiempo de espera agotado esperando respuesta de la pulsera',
          ),
        );
      }, timeoutMs);

      this.pendingRequest = {
        prefijos: prefijosEsperados,
        resolve: (line: string) => {
          clearTimeout(timer);
          resolve(line);
        },
      };

      this.port!.write(command + '\n');
    });
  }

  private parseConfigLine(line: string): PulseraConfigSerial {
    if (!line.startsWith('CONFIG:')) {
      return { ssid: '', broker: '', mac: '' };
    }

    const fields = line.substring('CONFIG:'.length).split(';');
    const result: Record<string, string> = {};

    for (const field of fields) {
      const eq = field.indexOf('=');
      if (eq < 0) continue;
      result[field.substring(0, eq)] = field.substring(eq + 1);
    }

    return {
      ssid: result.ssid ?? '',
      broker: result.broker ?? '',
      port: result.port ? Number(result.port) : undefined,
      mac: result.mac ?? '',
    };
  }

  async getConfig(): Promise<PulseraConfigSerial> {
    const line = await this.sendCommand('GET_CONFIG', ['CONFIG:']);
    return this.parseConfigLine(line);
  }

  async setWifi(
    ssid: string,
    password: string,
  ): Promise<{ ok: boolean; raw: string }> {
    const raw = await this.sendCommand(`SET_WIFI:${ssid}|${password}`, [
      'OK:',
      'ERR:',
    ]);
    return { ok: raw.startsWith('OK'), raw };
  }

  async setMqtt(
    broker: string,
    port: number,
  ): Promise<{ ok: boolean; raw: string }> {
    const raw = await this.sendCommand(`SET_MQTT:${broker}|${port}`, [
      'OK:',
      'ERR:',
    ]);
    return { ok: raw.startsWith('OK'), raw };
  }

  onModuleDestroy() {
    void this.disconnect();
  }
}
