import { Injectable } from '@nestjs/common';
import { RatingStrategyPort } from '../../domain/ports/rating-strategy.port';
import { PolicyRatingStrategy } from '../../domain/models/policy-rating-strategy.enum';
import { RiskProfileVO } from '../../domain/models/policy.model';
import { InvalidPolicyException } from '../../domain/exceptions/invalid-policy.exception';

// LOYALTY — prima base * 0.85 (15% descuento), antigüedad >= 2 años
@Injectable()
export class LoyaltyRatingStrategy extends RatingStrategyPort {
  private readonly DISCOUNT_FACTOR = 0.85;
  private readonly MIN_YEARS = 2;

  getName(): PolicyRatingStrategy { return PolicyRatingStrategy.LOYALTY; }

  validate(riskProfile: RiskProfileVO): void {
    if (!riskProfile.customerSince) {
      throw new InvalidPolicyException('customerSince is required for LOYALTY strategy');
    }
    const years = new Date().getFullYear() - riskProfile.customerSince;
    if (years < this.MIN_YEARS) {
      throw new InvalidPolicyException(`Customer must have at least ${this.MIN_YEARS} years of seniority for LOYALTY strategy`);
    }
  }

  calculatePremium(basePremium: number, _riskProfile: RiskProfileVO): number {
    return basePremium * this.DISCOUNT_FACTOR;
  }
}
