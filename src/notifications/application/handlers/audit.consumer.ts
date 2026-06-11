import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload, logLevel } from 'kafkajs';

@Injectable()
export class AuditConsumer implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  private readonly topics = [
    'policy.issued',
    'policy.activated',
    'policy.suspended',
    'policy.reactivated',
    'policy.cancelled',
  ];

  constructor(private readonly config: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.config.get<string>('KAFKA_CLIENT_ID', 'insurance-api'),
      brokers: [this.config.get<string>('KAFKA_BROKER', 'localhost:9094')],
      logLevel: logLevel.WARN,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connectWithRetry();
  }

  private async connectWithRetry(retries = 5, delay = 5000): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // groupId DIFERENTE al NotificationsConsumer — ambos reciben todos los mensajes
        this.consumer = this.kafka.consumer({
          groupId: 'insurance-audit-group',
        });
        await this.consumer.connect();
        for (const topic of this.topics) {
          await this.consumer.subscribe({ topic, fromBeginning: false });
        }
        await this.consumer.run({
          eachMessage: async (payload: EachMessagePayload) => {
            await this.handleMessage(payload);
          },
        });
        console.log('[AuditConsumer] Listening on policy topics');
        return;
      } catch (error) {
        console.warn(`[AuditConsumer] Attempt ${attempt}/${retries} failed`);
        if (attempt === retries) return;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer?.disconnect();
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const event = JSON.parse(message.value?.toString() ?? '{}');
    console.log(
      `[Observer:Audit] TRACE | topic: ${topic} | partition: ${partition} | ` +
      `offset: ${message.offset} | policyId: ${event.policyId} | ` +
      `${event.oldStatus} → ${event.newStatus} | timestamp: ${event.timestamp}`
    );
  }
}
