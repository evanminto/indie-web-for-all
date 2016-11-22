import BaseError from './BaseError';

class NotFoundError extends BaseError {
  constructor(...args) {
    super(...args);
  }
}

export default NotFoundError;
