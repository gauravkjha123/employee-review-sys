import { HttpError } from 'routing-controllers';

export class CompanyNotFoundError extends HttpError {
    constructor() {
      super(404, `Company not found.`);
    }
  }