import { Injectable } from '@nestjs/common';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';
import { EventPublisherPort } from '../../../shared/events/ports/event-publisher.port';
import { PolicyStatus } from '../../domain/models/policy-status.enum';
import { PolicyNotFoundException } from '../../domain/exceptions/policy-not-found.exception';
import { InvalidStateTransitionException } from '../../domain/exceptions/invalid-state-transition.exception';
import { QuotedState } from '../../domain/states/quoted.state';
import { IssuedState } from '../../domain/states/issued.state';
import { ActiveState } from '../../domain/states/active.state';
import { SuspendedState } from '../../domain/states/suspended.state';
import { CancelledState } from '../../domain/states/cancelled.state';
import { PolicyStatePort } from '../../domain/ports/policy-state.port';

const STATE_MAP = new Map<PolicyStatus, PolicyStatePort>([
  [PolicyStatus.QUOTED, new QuotedState()],
  [PolicyStatus.ISSUED, new IssuedState()],
  [PolicyStatus.ACTIVE, new ActiveState()],
  [PolicyStatus.SUSPENDED, new SuspendedState()],
  [PolicyStatus.CANCELLED, new CancelledState()],
]);

const EVENT_MAP = new Map<PolicyStatus, string>([
  [PolicyStatus.ISSUED, 'policy.issued'],
  [PolicyStatus.ACTIVE, 'policy.activated'],
  [PolicyStatus.SUSPENDED, 'policy.suspended'],
  [PolicyStatus.CANCELLED, 'policy.cancelled'],
]);

@Injectable()
export class ChangePolicyStatusUseCase {
  constructor(
    private readonly policyRepository: PolicyRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(policyId: string, targetStatus: PolicyStatus) {
    const policy = await this.policyRepository.findById(policyId);
    if (!policy) throw new PolicyNotFoundException(policyId);

    const oldStatus = policy.status;

    const currentState = STATE_MAP.get(policy.status);
    if (!currentState) {
      throw new InvalidStateTransitionException(policy.status, targetStatus);
    }

    const updated = currentState.transitionTo(targetStatus, policy);
    const saved = await this.policyRepository.update(updated);

    const topic = EVENT_MAP.get(targetStatus) ?? 'policy.changed';
    await this.eventPublisher.publish(topic, {
      policyId: saved.id,
      policyNumber: saved.policyNumber,
      customerId: saved.customerId,
      branch: saved.branch,
      oldStatus,
      newStatus: saved.status,
      timestamp: new Date().toISOString(),
    });

    return saved;
  }
}
