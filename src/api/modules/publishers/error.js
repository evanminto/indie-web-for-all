/**
 * Transforms an error into a representation that the API can safely return.
 */
class ErrorPublisher {
  /**
   * @param  {BaseError} baseError
   * @return {Object}
   */
  publishBaseError(baseError) {
    return {
      message: baseError.message,
    };
  }
}

export default new ErrorPublisher();
