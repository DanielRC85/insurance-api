import { PolicyModel } from '../models/policy.model';

// Puerto del repositorio de pólizas
export abstract class PolicyRepositoryPort {
  abstract findById(id: string): Promise<PolicyModel | null>;
  abstract findByCustomerId(customerId: string): Promise<PolicyModel[]>;
  abstract findByPolicyNumber(policyNumber: string): Promise<PolicyModel | null>;
  abstract save(policy: PolicyModel): Promise<PolicyModel>;
  abstract update(policy: PolicyModel): Promise<PolicyModel>;
}
