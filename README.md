# Insurance API — Canteras Sofka

API de gestión de pólizas de seguros construida con arquitectura hexagonal y 6 patrones de diseño GoF.

## Stack

- **NestJS + TypeScript** — framework principal
- **TypeORM + PostgreSQL** — persistencia real con Mapper pattern
- **Kafka (KafkaJS)** — broker de eventos para el patrón Observer
- **Swagger/OpenAPI** — documentación en `/api/docs`

Por qué este stack: es el mismo del `bank-api` de referencia del curso, lo que permite demostrar que los patrones se entienden lo suficiente para aplicarlos en un dominio diferente sin copiar código.

---

## Patrones aplicados

| Patrón | Archivo(s) |
|---|---|
| **Factory Method** | `src/policies/application/factories/` — 4 factories (Auto, Life, Home, Health) |
| **Builder** | `src/policies/application/builders/policy.builder.ts` |
| **State** | `src/policies/domain/states/` — 5 estados del ciclo de vida |
| **Strategy** | `src/policies/application/strategies/` — 3 estrategias de tarificación |
| **Observer** | `src/shared/events/` + `src/notifications/application/handlers/` |
| **Singleton** | `src/shared/events/infrastructure/policy-number-sequencer.ts` |

---

## Arquitectura Hexagonal

Cada módulo tiene tres capas bien delimitadas. El dominio no importa TypeORM, Kafka ni HTTP.

    src/
    ├── customers/
    │   ├── domain/           modelos, ports, excepciones (TypeScript puro)
    │   ├── application/      use cases, DTOs
    │   └── infrastructure/   TypeORM entity, mapper, repository, controller
    ├── policies/
    │   ├── domain/           modelos, ports, excepciones, estados
    │   ├── application/      use cases, factories, strategies, builder
    │   └── infrastructure/   TypeORM entity, mapper, repository, controller
    ├── notifications/
    │   └── application/handlers/   NotificationsConsumer, AuditConsumer
    └── shared/events/
        ├── ports/            EventPublisherPort
        └── infrastructure/   KafkaEventPublisher, PolicyNumberSequencer

---

## Levantar el proyecto

### Requisitos

- Docker Desktop instalado y corriendo
- Node.js 18+
- npm

### Paso 1 — Variables de entorno

```bash
cp .env.example .env
```

### Paso 2 — Levantar BD y Kafka

```bash
docker-compose up -d
```

### Paso 3 — Instalar dependencias

```bash
npm install
```

### Paso 4 — Correr la app

```bash
npm run start:dev
```

### URLs

- **Swagger:** http://localhost:3000/api/docs
- **Kafka UI:** http://localhost:8080
- **PostgreSQL:** localhost:5433

---

## Ciclo de vida de una póliza (State Pattern)

```
QUOTED → ISSUED → ACTIVE → SUSPENDED → ACTIVE → CANCELLED
```

Cada estado es una clase que encapsula sus transiciones válidas. El use case no contiene switch ni if por estado — delega en el estado actual via `transitionTo()`. Transiciones inválidas retornan HTTP 400 con excepción descriptiva.

---

## Estrategias de tarificación (Strategy Pattern)

| Estrategia | Fórmula | Validación |
|---|---|---|
| STANDARD | prima base sin ajuste | ninguna |
| RISK_BASED | prima base x (1 + riskScore/100) | riskScore entre 0 y 100 obligatorio |
| LOYALTY | prima base x 0.85 | customerSince obligatorio, antigüedad mayor o igual a 2 años |

---

## Primas base por ramo (Factory Method)

| Ramo | Prima base | Cobertura |
|---|---|---|
| AUTO | $120.000 | $80.000.000, deducible $1.000.000 |
| LIFE | $90.000 | $200.000.000, beneficiario requerido |
| HOME | $75.000 | $150.000.000, deducible $2.000.000 |
| HEALTH | $180.000 | $100.000.000, copago 20%, espera 30 días |

---

## Singleton — PolicyNumberSequencer

Genera números únicos y consecutivos con formato `POL-2026-000001`.

**Por qué amerita Singleton:** debe existir una sola instancia en toda la aplicación para garantizar que no haya dos pólizas con el mismo número cuando múltiples requests concurrentes crean pólizas simultáneamente.

**Cómo se garantiza la unicidad:** NestJS inyecta el servicio con scope singleton por defecto — una sola instancia compartida en toda la aplicación. Este enfoque es preferible al Singleton manual porque el contenedor de DI lo gestiona automáticamente.

**Riesgo mitigado:** se evita el Singleton "a mano" con estado global que rompe la testabilidad. El scope del contenedor de DI permite reemplazar la instancia con un mock en tests unitarios sin modificar el código de producción.

---

## Eventos publicados (Observer Pattern)

| Transición | Topic Kafka |
|---|---|
| QUOTED → ISSUED | policy.issued |
| ISSUED → ACTIVE | policy.activated |
| ACTIVE → SUSPENDED | policy.suspended |
| SUSPENDED → ACTIVE | policy.reactivated |
| cualquiera → CANCELLED | policy.cancelled |

Dos consumers independientes suscritos a los mismos topics con groupId diferente garantizan que ambos reciben todos los eventos:

- `insurance-notifications-group` — NotificationsConsumer
- `insurance-audit-group` — AuditConsumer
