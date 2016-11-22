import BaseError from './BaseError';

class AuthorizationError extends BaseError {
  constructor(...args) {
    super(...args);
  }
}

export default AuthorizationError;
