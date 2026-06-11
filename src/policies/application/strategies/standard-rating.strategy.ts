import { Injectable } from '@nestjs/common';
import { RatingStrategyPort } from '../../domain/ports/rating-strategy.port';
import { PolicyRatingStrategy } from '../../domain/models/policy-rating-strategy.enum';
import { RiskProfileVO } from '../../domain/models/policy.model';

// STANDARD — prima base sin ajuste
@Injectable()
export class StandardRatingStrategy extends RatingStrategyPort {
  getName(): PolicyRatingStrategy { return PolicyRatingStrategy.STANDARD; }
  validate(_riskProfile: RiskProfileVO): void { /* sin validaciones específicas */ }
  calculatePremium(basePremium: number, _riskProfile: RiskProfileVO): number {
    return basePremium;
  }
}
