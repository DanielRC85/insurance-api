import { PolicyStatePort } from '../ports/policy-state.port';
import { PolicyModel } from '../models/policy.model';
import { PolicyStatus } from '../models/policy-status.enum';
import { InvalidStateTransitionException } from '../exceptions/invalid-state-transition.exception';

// QUOTED puede ir a ISSUED o CANCELLED
export class QuotedState extends PolicyStatePort {
  getStatus(): PolicyStatus { return PolicyStatus.QUOTED; }

  transitionTo(target: PolicyStatus, policy: PolicyModel): PolicyModel {
    if (target === PolicyStatus.ISSUED) {
      return { ...policy, status: PolicyStatus.ISSUED, updatedAt: new Date() };
    }
    if (target === PolicyStatus.CANCELLED) {
      return { ...policy, status: PolicyStatus.CANCELLED, updatedAt: new Date() };
    }
    throw new InvalidStateTransitionException('QUOTED', target);
  }
}
