import BaseError from './BaseError';

class AuthenticationError extends BaseError {
  constructor(...args) {
    super(...args);
  }
}

export default AuthenticationError;
