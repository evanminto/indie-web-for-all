class ErrorPublisher {
  publishSequelizeError(sqlError) {
    const published = {
      message: sqlError.message,
      errors: [],
    };

    sqlError.errors.forEach((error) => {
      published.errors.push({
        message: error.message,
        field: error.path,
      });
    })

    return published;
  }
}

export default new ErrorPublisher();
