import { Injectable } from '@nestjs/common';
import { CustomerModel } from '../../domain/models/customer.model';
import { CustomerTypeormEntity } from './customer.typeorm-entity';

// Mapper bidireccional — ORM Entity ↔ Domain Model
@Injectable()
export class CustomerMapper {
  toDomain(entity: CustomerTypeormEntity): CustomerModel {
    return new CustomerModel({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toEntity(domain: CustomerModel): CustomerTypeormEntity {
    const entity = new CustomerTypeormEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.email = domain.email;
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
