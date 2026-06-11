import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository.port';
import { CustomerModel } from '../../domain/models/customer.model';
import { CustomerTypeormEntity } from './customer.typeorm-entity';
import { CustomerMapper } from './customer.mapper';

// Implementación del puerto — vive en infrastructure/
@Injectable()
export class CustomerTypeormRepository extends CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerTypeormEntity)
    private readonly repo: Repository<CustomerTypeormEntity>,
    private readonly mapper: CustomerMapper,
  ) { super(); }

  async findById(id: string): Promise<CustomerModel | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<CustomerModel | null> {
    const entity = await this.repo.findOne({ where: { email } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(): Promise<CustomerModel[]> {
    const entities = await this.repo.find();
    return entities.map((e) => this.mapper.toDomain(e));
  }

  async save(customer: CustomerModel): Promise<CustomerModel> {
    const entity = this.mapper.toEntity(customer);
    const saved = await this.repo.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(customer: CustomerModel): Promise<CustomerModel> {
    const entity = this.mapper.toEntity(customer);
    const updated = await this.repo.save(entity);
    return this.mapper.toDomain(updated);
  }
}
