import { Module } from '@nestjs/common';
import { EventPublisherPort } from './ports/event-publisher.port';
import { KafkaEventPublisher } from './infrastructure/kafka-event-publisher';
import { PolicyNumberSequencer } from './infrastructure/policy-number-sequencer';

@Module({
  providers: [
    { provide: EventPublisherPort, useClass: KafkaEventPublisher },
    PolicyNumberSequencer,
  ],
  exports: [EventPublisherPort, PolicyNumberSequencer],
})
export class EventsModule {}
