/**
 * Represents a generic error. Don't use this class directly —
 * use one its base classes.
 */
class BaseError extends Error {
  constructor(message) {
    super(message);

    this.message = message;
  }
}

export default BaseError;
