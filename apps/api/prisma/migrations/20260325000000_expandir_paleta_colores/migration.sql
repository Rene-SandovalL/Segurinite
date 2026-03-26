INSERT INTO `colores` (`nombre`, `valor_hex`)
VALUES
  ('Azul', '#575EAA'),
  ('Coral', '#FF7043'),
  ('Verde', '#2E7D32'),
  ('Gris', '#37474F'),
  ('Rojo', '#E53935'),
  ('Naranja', '#FB8C00'),
  ('Amarillo', '#FDD835'),
  ('Lima', '#C0CA33'),
  ('Menta', '#66BB6A'),
  ('Turquesa', '#26A69A'),
  ('Cian', '#00ACC1'),
  ('Celeste', '#42A5F5'),
  ('Indigo', '#3949AB'),
  ('Violeta', '#7E57C2'),
  ('Morado', '#8E24AA'),
  ('Rosa', '#EC407A'),
  ('Magenta', '#D81B60'),
  ('Cafe', '#6D4C41'),
  ('Pizarra', '#546E7A'),
  ('Negro', '#263238')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`);
