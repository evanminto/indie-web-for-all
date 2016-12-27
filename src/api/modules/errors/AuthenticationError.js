import BaseError from './BaseError';

/**
 * Represents an error in verifying a user's identity.
 */
class AuthenticationError extends BaseError {
  constructor(...args) {
    super(...args);
  }
}

export default AuthenticationError;
