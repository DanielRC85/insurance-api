export class UnsupportedBranchException extends Error {
  constructor(branch: string) {
    super(`Unsupported branch: "${branch}"`);
    this.name = 'UnsupportedBranchException';
  }
}
