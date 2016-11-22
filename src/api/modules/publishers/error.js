class ErrorPublisher {
  publishBaseError(baseError) {
    return {
      message: baseError.message,
    };
  }
}

export default new ErrorPublisher();
