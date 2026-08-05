CREATE TABLE IF NOT EXISTS telemetria (
  time         TIMESTAMPTZ NOT NULL DEFAULT now(),
  mac_address  TEXT NOT NULL,
  alumno_id    BIGINT,        -- resuelto por el backend (mac -> pulsera -> alumno) ANTES de insertar aquí;
                               -- no se puede resolver con un JOIN porque alumnos vive en la otra base
  beacon_id    INTEGER,       -- BEACON_ID del firmware; NULL cuando el payload manda area:-1
  bpm          SMALLINT,
  spo2         NUMERIC(4,1),
  temperatura  NUMERIC(4,1)
);

SELECT create_hypertable('telemetria', 'time', if_not_exists => TRUE);

CREATE INDEX IF NOT EXISTS idx_telemetria_alumno_time ON telemetria (alumno_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_telemetria_mac_time   ON telemetria (mac_address, time DESC);