import BaseError from './BaseError';

/**
 * Represents an error in verifying a user's permission to perform an operation.
 */
class AuthorizationError extends BaseError {
  constructor(...args) {
    super(...args);
  }
}

export default AuthorizationError;
