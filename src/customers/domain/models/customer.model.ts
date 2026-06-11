// Modelo de dominio puro del cliente — sin TypeORM
export class CustomerModel {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    Object.assign(this, props);
  }
}
