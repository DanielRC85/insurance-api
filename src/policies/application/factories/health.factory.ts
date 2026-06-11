import { Injectable } from '@nestjs/common';
import { PolicyFactoryPort } from '../../domain/ports/policy-factory.port';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { CoverageVO } from '../../domain/models/policy.model';

// Factory HEALTH — cobertura por defecto para salud
@Injectable()
export class HealthPolicyFactory extends PolicyFactoryPort {
  getBranch(): PolicyBranch { return PolicyBranch.HEALTH; }
  getBasePremium(): number { return 180000; }
  createDefaultCoverage(): CoverageVO {
    return {
      coverageAmount: 100000000,
      copayRate: 0.20,
      waitingPeriodDays: 30,
      termMonths: 12,
    };
  }
}
