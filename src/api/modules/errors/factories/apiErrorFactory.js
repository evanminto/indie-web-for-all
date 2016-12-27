/**
 * @external BaseError
 * @see http://docs.sequelizejs.com/en/v3/api/errors/
 */

import HttpStatuses from 'http-status-codes';

import ApiError from '../ApiError';
import BaseError from '../BaseError';
import NotFoundError from '../NotFoundError';
import ValidationError from '../ValidationError';

/**
 * Defines blueprints for BaseError objects based on input values.
 */
class ApiErrorFactory {
  /**
   * @param  {external:BaseError} sqlError [description]
   * @return {ApiError}
   */
  createFromSequelizeError(sqlError) {
    const apiError = new ApiError(HttpStatuses.BAD_REQUEST);

    apiError.message = sqlError.message;

    if (sqlError.errors) {
      sqlError.errors.forEach((error) => {
        apiError.addFieldError(error.path, error.message);
      });
    }

    return apiError;
  }

  /**
   * Converts a BaseError into an ApiError version using the correct HTTP status.
   *
   * If passed an ApiError, it just returns it back.
   *
   * @param  {BaseError} error
   * @return {ApiError}
   * @throws {TypeError} If passed a non-BaseError
   */
  createFromBaseError(error) {
    if (!(error instanceof BaseError)) {
      throw new TypeError('First argument must be an instance of BaseError.');
    }

    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof NotFoundError) {
      return new ApiError(HttpStatuses.NOT_FOUND, error.message);
    }

    if (error instanceof ValidationError) {
      return new ApiError(HttpStatuses.BAD_REQUEST, error.message);
    }

    return this.createFromMessage(error.message);
  }

  /**
   * Creates a generic ApiError based on a provided error message.
   *
   * @param  {String} message
   * @return {ApiError}
   */
  createFromMessage(message) {
    return new ApiError(HttpStatuses.INTERNAL_SERVER_ERROR, message);
  }
}

export default new ApiErrorFactory();
