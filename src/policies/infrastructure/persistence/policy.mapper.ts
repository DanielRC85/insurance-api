import { Injectable } from '@nestjs/common';
import { PolicyModel } from '../../domain/models/policy.model';
import { PolicyTypeormEntity } from './policy.typeorm-entity';

// Mapper bidireccional Policy
@Injectable()
export class PolicyMapper {
  toDomain(entity: PolicyTypeormEntity): PolicyModel {
    return new PolicyModel({
      id: entity.id,
      policyNumber: entity.policyNumber,
      customerId: entity.customerId,
      branch: entity.branch,
      ratingStrategy: entity.ratingStrategy,
      status: entity.status,
      coverage: entity.coverage as any,
      monthlyPremium: Number(entity.monthlyPremium),
      riskProfile: entity.riskProfile as any,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toEntity(domain: PolicyModel): PolicyTypeormEntity {
    const entity = new PolicyTypeormEntity();
    entity.id = domain.id;
    entity.policyNumber = domain.policyNumber;
    entity.customerId = domain.customerId;
    entity.branch = domain.branch;
    entity.ratingStrategy = domain.ratingStrategy;
    entity.status = domain.status;
    entity.coverage = domain.coverage as any;
    entity.monthlyPremium = domain.monthlyPremium;
    entity.riskProfile = domain.riskProfile as any;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
