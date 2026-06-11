import { PolicyBranch } from '../models/policy-branch.enum';
import { CoverageVO } from '../models/policy.model';

// Contrato Factory — cada ramo implementa su cobertura por defecto
export abstract class PolicyFactoryPort {
  abstract getBranch(): PolicyBranch;
  abstract createDefaultCoverage(): CoverageVO;
  abstract getBasePremium(): number;
}
