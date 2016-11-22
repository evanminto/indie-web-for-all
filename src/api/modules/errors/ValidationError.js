import BaseError from './BaseError';

class ValidationError extends BaseError {
  constructor(...args) {
    super(...args);
  }
}

export default ValidationError;
