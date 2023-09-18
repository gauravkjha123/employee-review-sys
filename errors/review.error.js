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

export class SameReviewrAndRecipentError extends HttpError {
  constructor() {
    super(404, `Review and reciepnt can not be same`);
  }
}