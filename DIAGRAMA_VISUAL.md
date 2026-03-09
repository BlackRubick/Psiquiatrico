# 🎨 Diagrama Visual de Nuevas Funcionalidades - BIOPSYCHE

## 📐 Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌─────────────────────┐      │
│  │  PACIENTE        │         │  PROFESIONAL        │      │
│  │  Dashboard       │         │  Dashboard          │      │
│  ├──────────────────┤         ├─────────────────────┤      │
│  │ • Actividades    │         │ • Asignar Act.      │      │
│  │ • Emociones      │         │ • Gestionar Act. ✨ │      │
│  │ • Perfil ✨      │         │ • Lista Pacientes   │      │
│  │ • Medicación     │         │ • Citas ✨          │      │
│  │ • Citas ✨       │         │ • Dashboards        │      │
│  │ • Vigilancia ✨  │         │ • Calificaciones    │      │
│  │ • TLP Info       │         │ • Perfil            │      │
│  │ • Emergencia     │         └─────────────────────┘      │
│  └──────────────────┘                                       │
│                                                              │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ HTTP/REST API
                   │
┌──────────────────▼───────────────────────────────────────────┐
│                     BACKEND (Node.js/Express)                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              CONTROLADORES                          │    │
│  ├────────────────────────────────────────────────────┤    │
│  │ • authController                                    │    │
│  │ • pacienteController ✨                            │    │
│  │ • actividadController                               │    │
│  │ • citaController ✨                                 │    │
│  │ • vigilanciaPesoController ✨                       │    │
│  │ • emocionController                                 │    │
│  │ • medicamentoController                             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │                   MODELOS                           │    │
│  ├────────────────────────────────────────────────────┤    │
│  │ • Usuario                                           │    │
│  │ • Paciente ✨ (+ 4 campos nuevos)                  │    │
│  │ • Profesional                                       │    │
│  │ • Actividad                                         │    │
│  │ • Cita ✨ (nuevo modelo)                           │    │
│  │ • VigilanciaPeso ✨ (nuevo modelo)                 │    │
│  │ • EmocionDiaria                                     │    │
│  │ • Medicamento                                       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ Sequelize ORM
                   │
┌──────────────────▼───────────────────────────────────────────┐
│                    BASE DE DATOS (MySQL)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  pacientes  │  │    citas ✨  │  │ vigilancia_  │      │
│  │             │  │              │  │   peso ✨    │      │
│  │ • direccion │  │ • fecha      │  │ • peso       │      │
│  │ • contacto_ │  │ • hora       │  │ • fecha      │      │
│  │   emergencia│  │ • motivo     │  │ • notas      │      │
│  │   ✨        │  │ • estado     │  └──────────────┘      │
│  │ • peso_     │  └──────────────┘                         │
│  │   actual ✨ │                                           │
│  │ • altura ✨ │                                           │
│  └─────────────┘                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos - Calendario de Citas

```
┌──────────────┐
│ Profesional  │
│ crea cita    │
└──────┬───────┘
       │
       ▼
┌─────────────────────┐
│ POST /api/citas     │
│ {                   │
│   paciente_id,      │
│   profesional_id,   │
│   fecha,            │
│   hora,             │
│   motivo            │
│ }                   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ citaController      │
│ .create()           │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Modelo Cita         │
│ .create()           │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ MySQL INSERT        │
│ INTO citas          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Respuesta 201       │
│ { id, ...cita }     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Frontend actualiza  │
│ calendario          │
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│ Paciente puede ver  │
│ la cita en su       │
│ calendario          │
└─────────────────────┘
```

## 📊 Flujo de Datos - Vigilancia de Peso

```
┌──────────────┐
│  Paciente    │
│ registra peso│
└──────┬───────┘
       │
       ▼
┌─────────────────────────┐
│ POST /api/vigilancia-   │
│      peso               │
│ {                       │
│   peso: 70.5,           │
│   fecha: "2026-03-09",  │
│   notas: "..."          │
│ }                       │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ vigilanciaPesoController│
│ .create()               │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Modelo VigilanciaPeso   │
│ .create()               │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ MySQL INSERT            │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ GET /api/vigilancia-    │
│     peso                │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Cálculo de:             │
│ • Tendencias            │
│ • IMC                   │
│ • Porcentaje cambio     │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Frontend muestra:       │
│ • Historial             │
│ • Gráficos              │
│ • Alertas               │
└─────────────────────────┘
```

## 🎯 Interacciones de Usuario

### PACIENTE

```
┌─────────────────────────────────────────────┐
│          DASHBOARD DEL PACIENTE             │
└─────────────────────────────────────────────┘
              │
    ┌─────────┼──────────┬────────────┬──────────────┐
    │         │          │            │              │
    ▼         ▼          ▼            ▼              ▼
┌────────┐ ┌────────┐ ┌─────────┐ ┌────────┐  ┌──────────┐
│Perfil  │ │Citas   │ │Vigilancia│ │Emociones│ │Actividades│
│✨     │ │✨     │ │Peso ✨  │ │        │ │          │
└────────┘ └────────┘ └─────────┘ └────────┘  └──────────┘
    │         │          │
    │         │          │
    ▼         ▼          ▼
Ver:       Ver:        Registrar:
• Dirección • Citas    • Peso
• Contacto  • Fechas   • Fecha
  emergencia• Horas    • Notas
• Peso/Alta • Estados
• Tutor              Ver:
                     • Historial
                     • Tendencias
                     • IMC
```

### PROFESIONAL DE SALUD

```
┌─────────────────────────────────────────────┐
│      DASHBOARD DEL PROFESIONAL              │
└─────────────────────────────────────────────┘
              │
    ┌─────────┼──────────┬────────────┬──────────────┐
    │         │          │            │              │
    ▼         ▼          ▼            ▼              ▼
┌────────┐ ┌────────┐ ┌─────────┐ ┌────────┐  ┌──────────┐
│Citas   │ │Gestionar│ │Asignar │ │Lista   │ │Dashboards │
│✨     │ │Act. ✨  │ │Act.    │ │Pacientes│ │          │
└────────┘ └────────┘ └─────────┘ └────────┘  └──────────┘
    │         │          
    │         │          
    ▼         ▼          
Gestionar:  Gestionar:
• Crear     • Ver todas
• Editar    • Editar
• Eliminar  • Eliminar
• Ver       • Filtrar
```

## 🗄️ Modelo de Datos - Relaciones

```
┌──────────────┐
│   Usuario    │
│              │
│ • id         │
│ • email      │
│ • password   │
│ • tipo       │
└──────┬───────┘
       │
       │ 1:1
       │
┌──────▼───────┐         ┌──────────────┐
│   Paciente   │ 1:N     │    Cita      │
│              ├────────►│              │
│ • id         │         │ • id         │
│ • usuario_id │         │ • paciente_id│
│ • direccion ✨│        │ • profesional│
│ • contacto_ ✨│        │   _id        │
│   emergencia │         │ • fecha ✨   │
│ • peso_actual✨        │ • hora ✨    │
│ • altura ✨  │         │ • motivo ✨  │
└──────┬───────┘         │ • estado ✨  │
       │                 └──────────────┘
       │ 1:N
       │
┌──────▼───────┐
│ Vigilancia   │
│   Peso       │
│              │
│ • id         │
│ • paciente_id│
│ • peso ✨    │
│ • fecha ✨   │
│ • notas ✨   │
└──────────────┘


┌──────────────┐
│ Profesional  │
│              │
│ • id         │
│ • usuario_id │
└──────┬───────┘
       │
       │ 1:N
       │
       └────────────────────┐
                            │
                     ┌──────▼───────┐
                     │    Cita      │
                     │              │
                     │ • profesional│
                     │   _id        │
                     └──────────────┘
```

## 🎨 Componentes de UI

```
┌─────────────────────────────────────────────────────────┐
│                  Appointments.jsx                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────┐        │
│  │        Selector de Mes/Año                 │        │
│  │   ◄ Anterior    Marzo 2026    Siguiente ►  │        │
│  └────────────────────────────────────────────┘        │
│                                                          │
│  ┌────────────────────────────────────────────┐        │
│  │           Calendario Mensual               │        │
│  │  Dom   Lun   Mar   Mié   Jue   Vie   Sáb  │        │
│  │  ───   ───   ───   ───   ───   ───   ───  │        │
│  │        [1]   [2]   [3]   [4]   [5]   [6]  │        │
│  │  [7]   [8]   [9]   [10]  [11]  [12]  [13] │        │
│  │              10:00       14:30              │        │
│  │  [14]  [15]  [16]  [17]  [18]  [19]  [20] │        │
│  └────────────────────────────────────────────┘        │
│                                                          │
│  ┌────────────────────────────────────────────┐        │
│  │         Lista de Citas del Mes             │        │
│  ├────────────────────────────────────────────┤        │
│  │ 📅 Lunes, 10 de marzo de 2026              │        │
│  │ 🕐 10:00                                    │        │
│  │ Motivo: Consulta de seguimiento            │        │
│  │ Estado: Confirmada                          │        │
│  │                           [Editar] [Borrar] │        │
│  └────────────────────────────────────────────┘        │
│                                                          │
└─────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────┐
│                WeightTracking.jsx                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────┐  ┌────────┐  ┌────────┐                   │
│  │ Peso   │  │  IMC   │  │Tendencia│                   │
│  │ Actual │  │        │  │        │                   │
│  │ 70.5kg │  │  22.4  │  │  ↓-2kg │                   │
│  └────────┘  └────────┘  └────────┘                   │
│                                                          │
│  ┌────────────────────────────────────────────┐        │
│  │    [+] Registrar Nuevo Peso                │        │
│  └────────────────────────────────────────────┘        │
│                                                          │
│  ┌────────────────────────────────────────────┐        │
│  │         Historial de Peso                  │        │
│  ├────────────────────────────────────────────┤        │
│  │ 📅 9 de marzo de 2026                      │        │
│  │ ⚖️  70.5 kg  ↓ -2.0 kg                     │        │
│  │ Notas: Peso estable                        │        │
│  ├────────────────────────────────────────────┤        │
│  │ 📅 2 de marzo de 2026                      │        │
│  │ ⚖️  72.5 kg  ↑ +1.5 kg                     │        │
│  └────────────────────────────────────────────┘        │
│                                                          │
│  ℹ️ Los medicamentos psiquiátricos pueden afectar      │
│     el peso. Monitorea los cambios regularmente.       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🚦 Estados y Permisos

```
┌────────────────────────────────────────────────────────┐
│                    PERMISOS                             │
├────────────────────────────────────────────────────────┤
│                                                         │
│  CITAS:                                                │
│  ┌──────────┬────────┬───────────┬───────┐           │
│  │ Acción   │ Admin  │Healthcare │Patient│           │
│  ├──────────┼────────┼───────────┼───────┤           │
│  │ Ver      │   ✅   │     ✅    │  ✅*  │           │
│  │ Crear    │   ✅   │     ✅    │  ❌   │           │
│  │ Editar   │   ✅   │     ✅    │  ❌   │           │
│  │ Eliminar │   ✅   │     ✅    │  ❌   │           │
│  └──────────┴────────┴───────────┴───────┘           │
│  * Solo sus propias citas                             │
│                                                         │
│  VIGILANCIA PESO:                                      │
│  ┌──────────┬────────┬───────────┬───────┐           │
│  │ Acción   │ Admin  │Healthcare │Patient│           │
│  ├──────────┼────────┼───────────┼───────┤           │
│  │ Ver      │   ✅   │    ✅*    │  ✅*  │           │
│  │ Crear    │   ✅   │     ❌    │  ✅   │           │
│  │ Editar   │   ✅   │     ❌    │  ✅*  │           │
│  │ Eliminar │   ✅   │     ❌    │  ✅*  │           │
│  └──────────┴────────┴───────────┴───────┘           │
│  * Solo sus propios registros                         │
│                                                         │
│  ACTIVIDADES:                                          │
│  ┌──────────┬────────┬───────────┬───────┐           │
│  │ Acción   │ Admin  │Healthcare │Patient│           │
│  ├──────────┼────────┼───────────┼───────┤           │
│  │ Ver      │   ✅   │     ✅    │  ✅*  │           │
│  │ Crear    │   ✅   │     ✅    │  ❌   │           │
│  │ Editar   │   ✅   │     ✅    │  ❌   │ ✨        │
│  │ Eliminar │   ✅   │     ✅    │  ❌   │ ✨        │
│  └──────────┴────────┴───────────┴───────┘           │
│  * Solo actividades asignadas a ellos                 │
│                                                         │
└────────────────────────────────────────────────────────┘
```

## 📱 Navegación de la App

```
┌─────────────────────────┐
│      Landing Page       │
│      /                  │
└───────────┬─────────────┘
            │
     ┌──────┴──────┐
     │             │
     ▼             ▼
┌─────────┐   ┌──────────┐
│ Login   │   │ Register │
│         │   │          │
└────┬────┘   └──────────┘
     │
     │
┌────▼─────────────────────────────────────────┐
│           Autenticación                       │
└────┬──────────────────────┬──────────────────┘
     │                      │
     ▼                      ▼
┌─────────────────┐   ┌──────────────────────┐
│   PACIENTE      │   │   PROFESIONAL        │
│   Dashboard     │   │   Dashboard          │
└─────┬───────────┘   └────┬─────────────────┘
      │                    │
      │                    │
      ├─► Actividades      ├─► Asignar Act.
      ├─► Emociones        ├─► Gestionar Act. ✨
      ├─► Perfil ✨       ├─► Lista Pacientes
      ├─► Medicación       ├─► Citas ✨
      ├─► Citas ✨        ├─► Dashboards
      ├─► Vigilancia ✨   ├─► Calificaciones
      ├─► TLP Info         └─► Perfil
      └─► Emergencia
```

## ✨ = Nueva Funcionalidad

---

**Fecha**: 9 de marzo de 2026  
**Sistema**: BIOPSYCHE  
**Estado**: ✅ COMPLETADO
