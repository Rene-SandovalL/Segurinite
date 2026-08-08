-- Inserta los 4 docentes que antes vivían hardcodeados en
-- apps/web/lib/mock/docentes.ts (ya borrado), usando los grupo_id reales
-- que existen hoy en la tabla grupos (1, 2, 3, 4).
--
-- Nota: el mock nunca tuvo RFC (campo nuevo en el schema real), así que
-- queda NULL — complétalo a mano o edítalo antes de correr esto.

INSERT INTO docentes (nombre, fecha_nacimiento, rfc, telefono, correo, observaciones, grupo_id, foto_url)
VALUES
  ('Raymundo Medrano',  '1985-03-12', NULL, '+52 55 1234 5678', 'r.medrano@segurinite.edu',   'Sin observaciones',     1, NULL),
  ('Laura Cifuentes',   '1990-11-07', NULL, '+52 55 8765 4321', 'l.cifuentes@segurinite.edu', 'En periodo de prueba',  2, NULL),
  ('Carlos Dominguez',  '1978-06-22', NULL, '+52 55 2222 3333', 'c.dominguez@segurinite.edu', 'Sin observaciones',     3, NULL),
  ('María López',       '1983-09-14', NULL, '+52 55 4444 5555', 'm.lopez@segurinite.edu',     'Sin observaciones',     4, NULL);
