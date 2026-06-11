import { Injectable } from '@nestjs/common';

// SINGLETON — genera números de póliza únicos y consecutivos
// NestJS garantiza una sola instancia via scope singleton del contenedor de DI
// Esto evita los problemas del Singleton manual (estado global, testabilidad)
@Injectable()
export class PolicyNumberSequencer {
  private counter: number = 0;

  generate(): string {
    this.counter++;
    const year = new Date().getFullYear();
    const sequence = String(this.counter).padStart(6, '0');
    return `POL-${year}-${sequence}`;
  }
}
