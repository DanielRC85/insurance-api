import { Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository.port';
import { CustomerNotFoundException } from '../../domain/exceptions/customer-not-found.exception';

@Injectable()
export class FindCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(id: string) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) throw new CustomerNotFoundException(id);
    return customer;
  }
}
