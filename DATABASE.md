# Estructura de Base de Datos - BIOPSYCHE

## Tablas de Base de Datos

### 1. **usuarios**
Tabla principal para almacenar información de todos los usuarios del sistema.

```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombreCompleto VARCHAR(150) NOT NULL,
  edad INT NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  tipo_usuario ENUM('paciente', 'healthcare', 'admin') NOT NULL,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_ultima_sesion TIMESTAMP NULL,
  UNIQUE KEY uk_email_username (email, username)
);
```

---

### 2. **pacientes**
Información específica de pacientes.

```sql
CREATE TABLE pacientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL UNIQUE,
  direccion VARCHAR(255),
  nombre_tutor VARCHAR(150),
  celular_tutor VARCHAR(20),
  psicologo_tratante VARCHAR(150),
  fecha_diagnostico DATE,
  numero_sesiones_completadas INT DEFAULT 0,
  numero_emergencias INT DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

---

### 3. **profesionales_salud**
Información específica de profesionales de la salud mental.

```sql
CREATE TABLE profesionales_salud (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL UNIQUE,
  cedula_profesional VARCHAR(50) UNIQUE NOT NULL,
  cargo_trabajo VARCHAR(100) NOT NULL,
  especialidad VARCHAR(100),
  numero_pacientes_asignados INT DEFAULT 0,
  verificado BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

---

### 4. **asignaciones_paciente_profesional**
Relación entre pacientes y profesionales de salud.

```sql
CREATE TABLE asignaciones_paciente_profesional (
  id INT PRIMARY KEY AUTO_INCREMENT,
  paciente_id INT NOT NULL,
  profesional_id INT NOT NULL,
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (profesional_id) REFERENCES profesionales_salud(id) ON DELETE CASCADE,
  UNIQUE KEY uk_paciente_profesional (paciente_id, profesional_id)
);
```

---

### 5. **actividades**
Actividades asignadas a pacientes.

```sql
CREATE TABLE actividades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  paciente_id INT NOT NULL,
  profesional_id INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  tipo ENUM('video', 'reading', 'writing', 'drawing') NOT NULL,
  frecuencia ENUM('diaria', 'semanal', 'mensual') NOT NULL,
  url_recurso VARCHAR(255),
  instrucciones_adicionales TEXT,
  completada BOOLEAN DEFAULT FALSE,
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_completacion TIMESTAMP NULL,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (profesional_id) REFERENCES profesionales_salud(id) ON DELETE SET NULL,
  INDEX idx_paciente_fecha (paciente_id, fecha_asignacion),
  INDEX idx_completada (completada)
);
```

---

### 6. **calificaciones_actividades**
Calificaciones y comentarios de actividades completadas.

```sql
CREATE TABLE calificaciones_actividades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  actividad_id INT NOT NULL UNIQUE,
  paciente_id INT NOT NULL,
  calificacion INT CHECK (calificacion >= 1 AND calificacion <= 10) NOT NULL,
  comentario_sentimiento TEXT,
  archivo_subido VARCHAR(255),
  fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  INDEX idx_paciente_fecha (paciente_id, fecha_calificacion)
);
```

---

### 7. **medicamentos**
Medicamentos del paciente.

```sql
CREATE TABLE medicamentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  paciente_id INT NOT NULL,
  nombre_medicamento VARCHAR(100) NOT NULL,
  dosis VARCHAR(50) NOT NULL,
  toma_manana BOOLEAN DEFAULT FALSE,
  toma_tarde BOOLEAN DEFAULT FALSE,
  toma_noche BOOLEAN DEFAULT FALSE,
  fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  INDEX idx_paciente_activo (paciente_id, activo)
);
```

---

### 8. **medicacion_tomada**
Registro de medicamentos tomados por el paciente.

```sql
CREATE TABLE medicacion_tomada (
  id INT PRIMARY KEY AUTO_INCREMENT,
  medicamento_id INT NOT NULL,
  paciente_id INT NOT NULL,
  fecha DATE NOT NULL,
  dia_semana ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
  hora ENUM('morning', 'afternoon', 'night') NOT NULL,
  tomado BOOLEAN DEFAULT FALSE,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  UNIQUE KEY uk_medicamento_fecha_hora (medicamento_id, fecha, hora),
  INDEX idx_paciente_fecha (paciente_id, fecha)
);
```

---

### 9. **emociones_diarias**
Registro emocional diario del paciente.

```sql
CREATE TABLE emociones_diarias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  paciente_id INT NOT NULL,
  fecha DATE NOT NULL,
  emocion_manana ENUM('happy', 'sad', 'angry', 'anxious', 'neutral', 'hurt'),
  emocion_tarde ENUM('happy', 'sad', 'angry', 'anxious', 'neutral', 'hurt'),
  emocion_noche ENUM('happy', 'sad', 'angry', 'anxious', 'neutral', 'hurt'),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  UNIQUE KEY uk_paciente_fecha (paciente_id, fecha),
  INDEX idx_paciente_fecha (paciente_id, fecha)
);
```

---

### 10. **emergencias**
Registro de presiones del botón de emergencia.

```sql
CREATE TABLE emergencias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  paciente_id INT NOT NULL,
  profesional_id INT,
  tipo_emergencia VARCHAR(100),
  descripcion TEXT,
  email_enviado_a VARCHAR(100),
  telefonico_enviado_a VARCHAR(20),
  estado ENUM('pendiente', 'en_proceso', 'resuelta') DEFAULT 'pendiente',
  actividades_calmantes_ofrecidas INT,
  fecha_emergencia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_resolucion TIMESTAMP NULL,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (profesional_id) REFERENCES profesionales_salud(id) ON DELETE SET NULL,
  INDEX idx_paciente_fecha (paciente_id, fecha_emergencia),
  INDEX idx_estado (estado)
);
```

---

### 11. **actividades_calma**
Banco de actividades de calma para emergencias.

```sql
CREATE TABLE actividades_calma (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  duracion_minutos INT,
  categoria VARCHAR(100),
  instrucciones TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activa BOOLEAN DEFAULT TRUE,
  UNIQUE KEY uk_titulo (titulo)
);
```

---

### 12. **dashboards_mensuales**
Resumen mensual de estadísticas del paciente.

```sql
CREATE TABLE dashboards_mensuales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  paciente_id INT NOT NULL,
  mes INT NOT NULL,
  anio INT NOT NULL,
  medicamentos_tomados INT DEFAULT 0,
  actividades_completadas INT DEFAULT 0,
  presiones_emergencia INT DEFAULT 0,
  emocion_predominante VARCHAR(50),
  calificacion_promedio_actividades DECIMAL(3,2),
  fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  UNIQUE KEY uk_paciente_mes_anio (paciente_id, mes, anio),
  INDEX idx_paciente_fecha (paciente_id, anio, mes)
);
```

---

## Relaciones Principales

```
usuarios (1) ──────── (1) pacientes
         └───────────── (1) profesionales_salud

pacientes (1) ──────────────── (M) actividades
        │
        ├──────────────── (M) medicamentos
        │
        ├──────────────── (M) emociones_diarias
        │
        ├──────────────── (M) emergencias
        │
        ├──────────────── (M) medicacion_tomada
        │
        └──────────────── (M) dashboards_mensuales

profesionales_salud (1) ────── (M) actividades
                    │
                    └─────── (M) emergencias

actividades (1) ────── (1) calificaciones_actividades

medicamentos (1) ────── (M) medicacion_tomada

asignaciones_paciente_profesional: Relación M-M entre pacientes y profesionales
```

---

## Índices Recomendados

