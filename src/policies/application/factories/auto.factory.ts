import { Injectable } from '@nestjs/common';
import { PolicyFactoryPort } from '../../domain/ports/policy-factory.port';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { CoverageVO } from '../../domain/models/policy.model';

// Factory AUTO — cobertura por defecto para vehículos
@Injectable()
export class AutoPolicyFactory extends PolicyFactoryPort {
  getBranch(): PolicyBranch { return PolicyBranch.AUTO; }
  getBasePremium(): number { return 120000; }
  createDefaultCoverage(): CoverageVO {
    return {
      coverageAmount: 80000000,
      deductible: 1000000,
      termMonths: 12,
    };
  }
}
