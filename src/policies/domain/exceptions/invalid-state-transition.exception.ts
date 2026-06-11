export class InvalidStateTransitionException extends Error {
  constructor(from: string, to: string) {
    super(`Invalid transition from "${from}" to "${to}"`);
    this.name = 'InvalidStateTransitionException';
  }
}
