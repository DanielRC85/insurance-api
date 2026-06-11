import { Injectable } from '@nestjs/common';
import { PolicyFactoryPort } from '../../domain/ports/policy-factory.port';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { CoverageVO } from '../../domain/models/policy.model';

// Factory LIFE — cobertura por defecto para vida
@Injectable()
export class LifePolicyFactory extends PolicyFactoryPort {
  getBranch(): PolicyBranch { return PolicyBranch.LIFE; }
  getBasePremium(): number { return 90000; }
  createDefaultCoverage(): CoverageVO {
    return {
      coverageAmount: 200000000,
      beneficiaryRequired: true,
      termMonths: 12,
    };
  }
}
