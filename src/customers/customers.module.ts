import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTypeormEntity } from './infrastructure/persistence/customer.typeorm-entity';
import { CustomerTypeormRepository } from './infrastructure/persistence/customer.typeorm-repository';
import { CustomerMapper } from './infrastructure/persistence/customer.mapper';
import { CustomerController } from './infrastructure/controllers/customer.controller';
import { CustomerRepositoryPort } from './domain/ports/customer-repository.port';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { FindCustomerUseCase } from './application/use-cases/find-customer.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTypeormEntity])],
  controllers: [CustomerController],
  providers: [
    CustomerMapper,
    { provide: CustomerRepositoryPort, useClass: CustomerTypeormRepository },
    CreateCustomerUseCase,
    FindCustomerUseCase,
  ],
  exports: [CustomerRepositoryPort],
})
export class CustomersModule {}
