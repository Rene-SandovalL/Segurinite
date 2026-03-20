CREATE TABLE `colores` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(60) NULL,
  `valor_hex` CHAR(7) NOT NULL,
  `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE INDEX `uq_colores_valor_hex`(`valor_hex`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `colores` (`nombre`, `valor_hex`)
VALUES
  ('Azul', '#575EAA'),
  ('Coral', '#FF7043'),
  ('Verde', '#2E7D32'),
  ('Gris', '#37474F');

ALTER TABLE `grupos`
  ADD COLUMN `color_id` INT UNSIGNED NULL AFTER `nombre`;

UPDATE `grupos`
SET `color_id` = (
  CASE `color`
    WHEN 'blue' THEN (SELECT `id` FROM `colores` WHERE `valor_hex` = '#575EAA' LIMIT 1)
    WHEN 'coral' THEN (SELECT `id` FROM `colores` WHERE `valor_hex` = '#FF7043' LIMIT 1)
    WHEN 'green' THEN (SELECT `id` FROM `colores` WHERE `valor_hex` = '#2E7D32' LIMIT 1)
    WHEN 'grey' THEN (SELECT `id` FROM `colores` WHERE `valor_hex` = '#37474F' LIMIT 1)
    ELSE NULL
  END
);

ALTER TABLE `grupos`
  MODIFY COLUMN `color_id` INT UNSIGNED NOT NULL,
  ADD CONSTRAINT `fk_grupos_color` FOREIGN KEY (`color_id`) REFERENCES `colores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD UNIQUE INDEX `uq_grupos_color_id`(`color_id`),
  ADD INDEX `idx_grupos_color_id`(`color_id`);

ALTER TABLE `grupos`
  DROP COLUMN `color`;
