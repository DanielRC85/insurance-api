import { PolicyStatePort } from '../ports/policy-state.port';
import { PolicyModel } from '../models/policy.model';
import { PolicyStatus } from '../models/policy-status.enum';
import { InvalidStateTransitionException } from '../exceptions/invalid-state-transition.exception';

// ISSUED puede ir a ACTIVE o CANCELLED
export class IssuedState extends PolicyStatePort {
  getStatus(): PolicyStatus { return PolicyStatus.ISSUED; }

  transitionTo(target: PolicyStatus, policy: PolicyModel): PolicyModel {
    if (target === PolicyStatus.ISSUED) {
      return { ...policy, updatedAt: new Date() }; // idempotente
    }
    if (target === PolicyStatus.ACTIVE) {
      return { ...policy, status: PolicyStatus.ACTIVE, updatedAt: new Date() };
    }
    if (target === PolicyStatus.CANCELLED) {
      return { ...policy, status: PolicyStatus.CANCELLED, updatedAt: new Date() };
    }
    throw new InvalidStateTransitionException('ISSUED', target);
  }
}
