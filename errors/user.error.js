import { HttpError } from 'routing-controllers';

export class UserNotFoundError extends HttpError {
  constructor() {
    super(404, `user not found.`);
  }
}
export class UserAlreadyExistError extends HttpError {
  constructor(email) {
    super(404, `user with email '${email}' already exist.`);
  }
}

export class invalidCredentialsError extends HttpError {
  constructor() {
    super(404, `Invalid credentails.`);
  }
}

export class PasswordNotMatchError extends HttpError {
  constructor() {
    super(404, `Password not match.`);
  }
}