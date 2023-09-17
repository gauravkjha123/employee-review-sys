import { HttpError } from 'routing-controllers';

export class ActionForbiddenError extends HttpError {
    constructor() {
        super(403, 'You are not allowed to perform this action');
    }
}
