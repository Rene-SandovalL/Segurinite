import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ReadlineParser, SerialPort } from 'serialport';

const BAUD_RATE = 115200;
const TIMEOUT_MS = 2000;

export interface PuertoSerialInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  vendorId?: string;
  productId?: string;
}

/**
 * Comunicación serial (USB) con un beacon ESP32 en modo configuración.
 * Protocolo de línea: GET_ID -> "ID:<n>", SET_ID:<n> -> "OK:<n>" | "ERR:...".
 * Puerto adaptado del bridge de referencia beacon-config-backend/src/beacon.
 */
@Injectable()
export class BeaconSerialService implements OnModuleDestroy {
  private port: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private pendingResolve: ((line: string) => void) | null = null;

  async listPorts(): Promise<PuertoSerialInfo[]> {
    return SerialPort.list();
  }

  async connect(path: string): Promise<{ connected: boolean; path: string }> {
    if (this.port?.isOpen) {
      await this.disconnect();
    }

    this.port = new SerialPort({ path, baudRate: BAUD_RATE });
    this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));

    this.parser.on('data', (line: string) => {
      if (this.pendingResolve) {
        const resolve = this.pendingResolve;
        this.pendingResolve = null;
        resolve(line.trim());
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
    timeoutMs = TIMEOUT_MS,
  ): Promise<string> {
    if (!this.port || !this.port.isOpen) {
      return Promise.reject(new Error('No hay conexión con el beacon'));
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingResolve = null;
        reject(
          new Error('Tiempo de espera agotado esperando respuesta del beacon'),
        );
      }, timeoutMs);

      this.pendingResolve = (line: string) => {
        clearTimeout(timer);
        resolve(line);
      };

      this.port!.write(command + '\n');
    });
  }

  async getId(): Promise<{ id: number | null; raw: string }> {
    const raw = await this.sendCommand('GET_ID');
    const match = /^ID:(-?\d+)$/.exec(raw);
    return { id: match ? Number(match[1]) : null, raw };
  }

  async setId(id: number): Promise<{ ok: boolean; raw: string }> {
    const raw = await this.sendCommand(`SET_ID:${id}`);
    return { ok: raw.startsWith('OK'), raw };
  }

  onModuleDestroy() {
    void this.disconnect();
  }
}
