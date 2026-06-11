export class PolicyNotFoundException extends Error {
  constructor(id: string) {
    super(`Policy with id "${id}" not found`);
    this.name = 'PolicyNotFoundException';
  }
}
