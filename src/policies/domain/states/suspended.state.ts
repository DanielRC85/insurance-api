import { PolicyStatePort } from '../ports/policy-state.port';
import { PolicyModel } from '../models/policy.model';
import { PolicyStatus } from '../models/policy-status.enum';
import { InvalidStateTransitionException } from '../exceptions/invalid-state-transition.exception';

// SUSPENDED puede ir a ACTIVE (reactivar) o CANCELLED
export class SuspendedState extends PolicyStatePort {
  getStatus(): PolicyStatus { return PolicyStatus.SUSPENDED; }

  transitionTo(target: PolicyStatus, policy: PolicyModel): PolicyModel {
    if (target === PolicyStatus.SUSPENDED) {
      return { ...policy, updatedAt: new Date() }; // idempotente
    }
    if (target === PolicyStatus.ACTIVE) {
      return { ...policy, status: PolicyStatus.ACTIVE, updatedAt: new Date() };
    }
    if (target === PolicyStatus.CANCELLED) {
      return { ...policy, status: PolicyStatus.CANCELLED, updatedAt: new Date() };
    }
    throw new InvalidStateTransitionException('SUSPENDED', target);
  }
}
