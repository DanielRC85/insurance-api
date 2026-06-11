import { Injectable } from '@nestjs/common';
import { PolicyStatePort } from '../ports/policy-state.port';
import { PolicyModel } from '../models/policy.model';
import { PolicyStatus } from '../models/policy-status.enum';
import { InvalidStateTransitionException } from '../exceptions/invalid-state-transition.exception';

@Injectable()
export class CancelledState extends PolicyStatePort {
  getStatus(): PolicyStatus { return PolicyStatus.CANCELLED; }

  transitionTo(target: PolicyStatus, _policy: PolicyModel): PolicyModel {
    throw new InvalidStateTransitionException('CANCELLED', target);
  }
}
