import { Injectable } from '@nestjs/common';
import { PolicyFactoryPort } from '../../domain/ports/policy-factory.port';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { CoverageVO } from '../../domain/models/policy.model';

// Factory HOME — cobertura por defecto para hogar
@Injectable()
export class HomePolicyFactory extends PolicyFactoryPort {
  getBranch(): PolicyBranch { return PolicyBranch.HOME; }
  getBasePremium(): number { return 75000; }
  createDefaultCoverage(): CoverageVO {
    return {
      coverageAmount: 150000000,
      deductible: 2000000,
      termMonths: 12,
    };
  }
}
