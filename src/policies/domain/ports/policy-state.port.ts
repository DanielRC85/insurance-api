import { PolicyModel } from '../models/policy.model';
import { PolicyStatus } from '../models/policy-status.enum';

// Contrato State — cada estado decide qué transiciones acepta
export abstract class PolicyStatePort {
  abstract getStatus(): PolicyStatus;
  abstract transitionTo(target: PolicyStatus, policy: PolicyModel): PolicyModel;
}
