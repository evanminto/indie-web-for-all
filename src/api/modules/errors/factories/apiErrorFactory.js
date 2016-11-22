import HttpStatuses from 'http-status-codes';

import ApiError from '../ApiError';

class ApiErrorFactory {
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
}

export default new ApiErrorFactory();
