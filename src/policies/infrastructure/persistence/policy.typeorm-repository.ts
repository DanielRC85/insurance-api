import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';
import { PolicyModel } from '../../domain/models/policy.model';
import { PolicyTypeormEntity } from './policy.typeorm-entity';
import { PolicyMapper } from './policy.mapper';

@Injectable()
export class PolicyTypeormRepository extends PolicyRepositoryPort {
  constructor(
    @InjectRepository(PolicyTypeormEntity)
    private readonly repo: Repository<PolicyTypeormEntity>,
    private readonly mapper: PolicyMapper,
  ) { super(); }

  async findById(id: string): Promise<PolicyModel | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByCustomerId(customerId: string): Promise<PolicyModel[]> {
    const entities = await this.repo.find({ where: { customerId } });
    return entities.map((e) => this.mapper.toDomain(e));
  }

  async findByPolicyNumber(policyNumber: string): Promise<PolicyModel | null> {
    const entity = await this.repo.findOne({ where: { policyNumber } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async save(policy: PolicyModel): Promise<PolicyModel> {
    const entity = this.mapper.toEntity(policy);
    const saved = await this.repo.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(policy: PolicyModel): Promise<PolicyModel> {
    const entity = this.mapper.toEntity(policy);
    const updated = await this.repo.save(entity);
    return this.mapper.toDomain(updated);
  }
}
