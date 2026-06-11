import { Module } from '@nestjs/common';
import { NotificationsConsumer } from './application/handlers/notifications.consumer';
import { AuditConsumer } from './application/handlers/audit.consumer';

@Module({
  providers: [NotificationsConsumer, AuditConsumer],
})
export class NotificationsModule {}
