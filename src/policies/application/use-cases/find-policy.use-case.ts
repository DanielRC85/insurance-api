import { Injectable } from '@nestjs/common';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';
import { PolicyNotFoundException } from '../../domain/exceptions/policy-not-found.exception';

@Injectable()
export class FindPolicyUseCase {
  constructor(private readonly policyRepository: PolicyRepositoryPort) {}

  async execute(id: string) {
    const policy = await this.policyRepository.findById(id);
    if (!policy) throw new PolicyNotFoundException(id);
    return policy;
  }
}
