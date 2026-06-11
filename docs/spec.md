# Especificacion — Insurance API

## Objetivo
API REST para gestion de polizas de seguros que permite crear clientes, cotizar polizas por ramo, tarificarlas con diferentes estrategias y gestionar su ciclo de vida completo.

## Actores
- Customer: cliente que contrata polizas. Tiene nombre, email unico y estado activo/inactivo.

## Entidades
- Customer: id, name, email, isActive, timestamps
- Policy: id, policyNumber, customerId, branch, ratingStrategy, status, coverage, monthlyPremium, riskProfile, timestamps

## Reglas de negocio
- Toda poliza inicia en estado QUOTED
- La cobertura por defecto depende del ramo (Factory Method)
- La prima se calcula segun la estrategia elegida (Strategy)
- Las transiciones de estado siguen la maquina de estados definida (State)
- Cada transicion publica un evento al broker (Observer)

## Drivers de arquitectura
- Extensibilidad: agregar un ramo o estrategia = una clase nueva
- Mantenibilidad: dominio aislado de infraestructura
- Usabilidad: API REST documentada con Swagger
