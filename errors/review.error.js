import { HttpError } from 'routing-controllers';

export class ReviewNotFoundError extends HttpError {
  constructor() {
    super(404, `Review not found.`);
  }
}

export class ReviewAlreadyExistError extends HttpError {
  constructor() {
    super(404, `Review already exist.`);
  }
}
