export class UnsupportedRatingStrategyException extends Error {
  constructor(strategy: string) {
    super(`Unsupported rating strategy: "${strategy}"`);
    this.name = 'UnsupportedRatingStrategyException';
  }
}
