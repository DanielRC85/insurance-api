// Puerto Observer — el dominio publica eventos sin saber si es Kafka, RabbitMQ, etc.
export abstract class EventPublisherPort {
  abstract publish(topic: string, event: Record<string, any>): Promise<void>;
}
