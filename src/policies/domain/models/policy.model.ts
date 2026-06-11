import { PolicyBranch } from './policy-branch.enum';
import { PolicyRatingStrategy } from './policy-rating-strategy.enum';
import { PolicyStatus } from './policy-status.enum';

// Value Object: cobertura inmutable por ramo
export interface CoverageVO {
  coverageAmount: number;
  termMonths: number;
  deductible?: number;
  beneficiaryRequired?: boolean;
  copayRate?: number;
  waitingPeriodDays?: number;
}

// Value Object: perfil de riesgo del cliente
export interface RiskProfileVO {
  riskScore?: number;       // requerido para RISK_BASED
  customerSince?: number;   // año requerido para LOYALTY
}

// Modelo de dominio puro — sin decoradores de TypeORM ni NestJS
export class PolicyModel {
  id: string;
  policyNumber: string;
  customerId: string;
  branch: PolicyBranch;
  ratingStrategy: PolicyRatingStrategy;
  status: PolicyStatus;
  coverage: CoverageVO;
  monthlyPremium: number;
  riskProfile: RiskProfileVO;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: string;
    policyNumber: string;
    customerId: string;
    branch: PolicyBranch;
    ratingStrategy: PolicyRatingStrategy;
    status: PolicyStatus;
    coverage: CoverageVO;
    monthlyPremium: number;
    riskProfile: RiskProfileVO;
    createdAt: Date;
    updatedAt: Date;
  }) {
    Object.assign(this, props);
  }
}
