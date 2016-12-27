import BaseError from './BaseError';

/**
 * Represents an error in processing an API request.
 */
class ApiError extends BaseError {
  constructor(statusCode = 500, message = 'Something went wrong.') {
    super(message);

    this.statusCode = statusCode;
    this.fieldErrors = [];
  }

  addFieldError(name, message) {
    this.fieldErrors.push({
      field: name,
      message: message,
    });
  }

  /**
   * The JSON body to use when returning this error in the API response.
   *
   * @return {Object}
   */
  get json() {
    // TODO: Add prod-specific message.
    return {
      message: this.message,
      errors: this.fieldErrors,
    };
  }
}

export default ApiError;
