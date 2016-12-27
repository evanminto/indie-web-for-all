import BaseError from './BaseError';

/**
 * Represents an error in validating the values of a resource.
 */
class ValidationError extends BaseError {
  constructor(...args) {
    super(...args);
  }
}

export default ValidationError;
