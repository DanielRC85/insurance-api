# Plan de Diseno — Insurance API

## Factory Method
Problema: crear polizas de diferentes ramos con coberturas distintas sin switch en el use case.
Solucion: PolicyFactoryPort + 4 factories concretas. Seleccion por Map en el modulo.
OCP: agregar ramo TRAVEL = crear TravelPolicyFactory + registrar en el Map. Cero cambios en use cases.

## Builder
Problema: construir el agregado Policy con multiples campos obligatorios garantizando estado inicial QUOTED.
Solucion: PolicyBuilder fluido que valida en build() y asigna QUOTED siempre.

## State
Problema: gestionar transiciones validas sin switch en el use case.
Solucion: PolicyStatePort + 5 clases con Injectable. Cada estado encapsula sus transiciones via transitionTo(). Los estados se inyectan via POLICY_STATES Map en el modulo.
Maquina: QUOTED -> ISSUED -> ACTIVE -> SUSPENDED -> ACTIVE -> CANCELLED

## Strategy
Problema: calcular la prima con algoritmos intercambiables sin switch en el use case.
Solucion: RatingStrategyPort + 3 strategies. Seleccion por Map en el modulo.

## Observer
Problema: notificar eventos sin acoplar el use case a los consumidores.
Solucion: EventPublisherPort + KafkaEventPublisher. Dos consumers con groupId diferente:
- insurance-notifications-group
- insurance-audit-group

## Singleton
Problema: generar numeros de poliza unicos sin colisiones concurrentes.
Solucion: PolicyNumberSequencer con scope singleton del contenedor de DI de NestJS.
