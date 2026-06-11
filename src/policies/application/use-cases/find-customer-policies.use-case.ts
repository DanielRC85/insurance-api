import { Injectable } from '@nestjs/common';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';

@Injectable()
export class FindCustomerPoliciesUseCase {
  constructor(private readonly policyRepository: PolicyRepositoryPort) {}

  async execute(customerId: string) {
    return this.policyRepository.findByCustomerId(customerId);
  }
}
