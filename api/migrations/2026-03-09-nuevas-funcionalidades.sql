-- Migración para agregar nuevas funcionalidades al sistema BIOPSYCHE
-- Fecha: 9 de marzo de 2026
-- Compatible con re-ejecución: evita errores por columnas ya existentes

-- 1. Agregar nuevos campos a la tabla pacientes
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'pacientes'
     AND COLUMN_NAME = 'contacto_emergencia') = 0,
  'ALTER TABLE pacientes ADD COLUMN contacto_emergencia VARCHAR(20)',
  'SELECT "contacto_emergencia ya existe"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'pacientes'
     AND COLUMN_NAME = 'nombre_contacto_emergencia') = 0,
  'ALTER TABLE pacientes ADD COLUMN nombre_contacto_emergencia VARCHAR(150)',
  'SELECT "nombre_contacto_emergencia ya existe"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'pacientes'
     AND COLUMN_NAME = 'peso_actual') = 0,
  'ALTER TABLE pacientes ADD COLUMN peso_actual DECIMAL(5,2)',
  'SELECT "peso_actual ya existe"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'pacientes'
     AND COLUMN_NAME = 'altura') = 0,
  'ALTER TABLE pacientes ADD COLUMN altura DECIMAL(4,2)',
  'SELECT "altura ya existe"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Crear tabla de citas
CREATE TABLE IF NOT EXISTS citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  profesional_id INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  motivo VARCHAR(255),
  notas TEXT,
  estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (profesional_id) REFERENCES profesionales_salud(id) ON DELETE CASCADE,
  INDEX idx_fecha (fecha),
  INDEX idx_paciente (paciente_id),
  INDEX idx_profesional (profesional_id)
);

-- 3. Crear tabla de vigilancia de peso
CREATE TABLE IF NOT EXISTS vigilancia_peso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  peso DECIMAL(5,2) NOT NULL,
  fecha DATE NOT NULL,
  notas TEXT,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  INDEX idx_paciente_fecha (paciente_id, fecha)
);

-- Comentarios sobre las nuevas funcionalidades:
-- - contacto_emergencia y nombre_contacto_emergencia: Para contactar a tutores adicionales en emergencias
-- - peso_actual y altura: Datos físicos del paciente, modificables
-- - citas: Calendario de citas con fecha, hora y estado
-- - vigilancia_peso: Historial de peso para monitoreo de efectos de medicación psiquiátrica
