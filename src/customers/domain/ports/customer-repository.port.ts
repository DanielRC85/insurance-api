import { CustomerModel } from '../models/customer.model';

// Puerto (contrato) — el dominio dice QUÉ necesita, sin saber CÓMO se implementa
export abstract class CustomerRepositoryPort {
  abstract findById(id: string): Promise<CustomerModel | null>;
  abstract findByEmail(email: string): Promise<CustomerModel | null>;
  abstract findAll(): Promise<CustomerModel[]>;
  abstract save(customer: CustomerModel): Promise<CustomerModel>;
  abstract update(customer: CustomerModel): Promise<CustomerModel>;
}
