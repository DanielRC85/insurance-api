import { PolicyRatingStrategy } from '../models/policy-rating-strategy.enum';
import { RiskProfileVO } from '../models/policy.model';

// Contrato Strategy — cada estrategia calcula la prima a su manera
export abstract class RatingStrategyPort {
  abstract getName(): PolicyRatingStrategy;
  abstract validate(riskProfile: RiskProfileVO): void;
  abstract calculatePremium(basePremium: number, riskProfile: RiskProfileVO): number;
}
