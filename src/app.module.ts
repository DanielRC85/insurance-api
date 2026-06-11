import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { PoliciesModule } from './policies/policies.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventsModule } from './shared/events/events.module';
import { CustomerTypeormEntity } from './customers/infrastructure/persistence/customer.typeorm-entity';
import { PolicyTypeormEntity } from './policies/infrastructure/persistence/policy.typeorm-entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME', 'insurance_db'),
        entities: [CustomerTypeormEntity, PolicyTypeormEntity],
        synchronize: true,
      }),
    }),
    CustomersModule,
    PoliciesModule,
    NotificationsModule,
    EventsModule,
  ],
})
export class AppModule {}
