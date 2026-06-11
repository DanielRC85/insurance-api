# Checklist de implementacion — Insurance API

## Dominio
- [x] Enums: PolicyBranch, PolicyRatingStrategy, PolicyStatus
- [x] Modelos: PolicyModel, CustomerModel con Value Objects
- [x] Ports: PolicyRepositoryPort, CustomerRepositoryPort, PolicyFactoryPort, RatingStrategyPort, PolicyStatePort, EventPublisherPort
- [x] Excepciones: PolicyNotFoundException, InvalidStateTransitionException, UnsupportedBranchException, UnsupportedRatingStrategyException, InvalidPolicyException, CustomerNotFoundException, EmailAlreadyExistsException
- [x] Estados con Injectable: QuotedState, IssuedState, ActiveState, SuspendedState, CancelledState

## Application
- [x] Factories: Auto, Life, Home, Health
- [x] Strategies: Standard, RiskBased, Loyalty
- [x] Builder: PolicyBuilder con validacion en build()
- [x] Use cases: CreatePolicy, FindPolicy, FindCustomerPolicies, ChangePolicyStatus, CreateCustomer, FindCustomer

## Infrastructure
- [x] TypeORM entities: CustomerTypeormEntity, PolicyTypeormEntity
- [x] Mappers: CustomerMapper, PolicyMapper
- [x] Repositories: CustomerTypeormRepository, PolicyTypeormRepository
- [x] Controllers: CustomerController, PolicyController
- [x] Kafka: KafkaEventPublisher, NotificationsConsumer, AuditConsumer
- [x] Singleton: PolicyNumberSequencer
- [x] Exception filter: DomainExceptionFilter

## Entrega
- [x] docker-compose.yml (PostgreSQL + Kafka + Kafka UI)
- [x] .env + .env.example configurados
- [x] Swagger en /api/docs
- [x] README con instrucciones completas y seccion Singleton
- [x] requests.http con 4 ramos, 3 estrategias, ciclo de vida y casos de error
- [x] Commits atomicos con mensajes claros
