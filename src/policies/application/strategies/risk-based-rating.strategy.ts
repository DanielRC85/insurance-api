import { Injectable } from '@nestjs/common';
import { RatingStrategyPort } from '../../domain/ports/rating-strategy.port';
import { PolicyRatingStrategy } from '../../domain/models/policy-rating-strategy.enum';
import { RiskProfileVO } from '../../domain/models/policy.model';
import { InvalidPolicyException } from '../../domain/exceptions/invalid-policy.exception';

@Injectable()
export class RiskBasedRatingStrategy extends RatingStrategyPort {
  getName(): PolicyRatingStrategy { return PolicyRatingStrategy.RISK_BASED; }

  validate(riskProfile: RiskProfileVO): void {
    if (riskProfile.riskScore === undefined || riskProfile.riskScore === null) {
      throw new InvalidPolicyException('riskScore is required for RISK_BASED strategy');
    }
    if (riskProfile.riskScore < 0 || riskProfile.riskScore > 100) {
      throw new InvalidPolicyException('riskScore must be between 0 and 100');
    }
  }

  calculatePremium(basePremium: number, riskProfile: RiskProfileVO): number {
    // Después de validate() riskScore está garantizado
    const score = riskProfile.riskScore!;
    return basePremium * (1 + score / 100);
  }
}
