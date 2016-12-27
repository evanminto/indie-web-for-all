import BaseError from './BaseError';

/**
 * Represents an error finding a resource.
 */
class NotFoundError extends BaseError {
  constructor(...args) {
    super(...args);
  }
}

export default NotFoundError;
