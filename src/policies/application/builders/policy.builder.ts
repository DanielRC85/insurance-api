import { v4 as uuidv4 } from 'uuid';
import { PolicyModel, CoverageVO, RiskProfileVO } from '../../domain/models/policy.model';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { PolicyRatingStrategy } from '../../domain/models/policy-rating-strategy.enum';
import { PolicyStatus } from '../../domain/models/policy-status.enum';
import { InvalidPolicyException } from '../../domain/exceptions/invalid-policy.exception';

// BUILDER — construye el agregado Policy paso a paso y valida en build()
export class PolicyBuilder {
  private _customerId: string;
  private _branch: PolicyBranch;
  private _ratingStrategy: PolicyRatingStrategy;
  private _coverage: CoverageVO;
  private _monthlyPremium: number;
  private _riskProfile: RiskProfileVO;
  private _policyNumber: string;

  forCustomer(customerId: string): this {
    this._customerId = customerId;
    return this;
  }

  withBranch(branch: PolicyBranch): this {
    this._branch = branch;
    return this;
  }

  withRatingStrategy(strategy: PolicyRatingStrategy): this {
    this._ratingStrategy = strategy;
    return this;
  }

  withCoverage(coverage: CoverageVO): this {
    this._coverage = coverage;
    return this;
  }

  withMonthlyPremium(premium: number): this {
    this._monthlyPremium = premium;
    return this;
  }

  withRiskProfile(riskProfile: RiskProfileVO): this {
    this._riskProfile = riskProfile;
    return this;
  }

  withPolicyNumber(policyNumber: string): this {
    this._policyNumber = policyNumber;
    return this;
  }

  // build() valida todo y asigna QUOTED como estado inicial obligatorio
  build(): PolicyModel {
    if (!this._customerId) throw new InvalidPolicyException('customerId is required');
    if (!this._branch) throw new InvalidPolicyException('branch is required');
    if (!this._ratingStrategy) throw new InvalidPolicyException('ratingStrategy is required');
    if (!this._coverage) throw new InvalidPolicyException('coverage is required');
    if (!this._monthlyPremium) throw new InvalidPolicyException('monthlyPremium is required');
    if (!this._policyNumber) throw new InvalidPolicyException('policyNumber is required');

    const now = new Date();
    return new PolicyModel({
      id: uuidv4(),
      policyNumber: this._policyNumber,
      customerId: this._customerId,
      branch: this._branch,
      ratingStrategy: this._ratingStrategy,
      status: PolicyStatus.QUOTED, // siempre inicia en QUOTED
      coverage: this._coverage,
      monthlyPremium: this._monthlyPremium,
      riskProfile: this._riskProfile ?? {},
      createdAt: now,
      updatedAt: now,
    });
  }
}
