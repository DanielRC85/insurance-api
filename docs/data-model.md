# Modelo de Datos — Insurance API

## Customer
| Campo | Tipo | Descripcion |
|---|---|---|
| id | UUID | Identificador unico |
| name | string | Nombre del cliente |
| email | string | Email unico |
| isActive | boolean | Estado activo |
| createdAt | timestamp | Fecha creacion |
| updatedAt | timestamp | Fecha actualizacion |

## Policy
| Campo | Tipo | Descripcion |
|---|---|---|
| id | UUID | Identificador unico |
| policyNumber | string | Numero unico POL-YYYY-XXXXXX |
| customerId | UUID | FK al cliente |
| branch | enum | AUTO, LIFE, HOME, HEALTH |
| ratingStrategy | enum | STANDARD, RISK_BASED, LOYALTY |
| status | enum | QUOTED, ISSUED, ACTIVE, SUSPENDED, CANCELLED |
| coverage | JSONB | Cobertura por defecto del ramo |
| monthlyPremium | decimal | Prima calculada por la estrategia |
| riskProfile | JSONB | Perfil de riesgo del cliente |
| createdAt | timestamp | Fecha creacion |
| updatedAt | timestamp | Fecha actualizacion |

## Primas base por ramo
| Ramo | Prima base | Cobertura |
|---|---|---|
| AUTO | 120000 | 80000000, deducible 1000000 |
| LIFE | 90000 | 200000000, beneficiario requerido |
| HOME | 75000 | 150000000, deducible 2000000 |
| HEALTH | 180000 | 100000000, copago 20%, espera 30 dias |
