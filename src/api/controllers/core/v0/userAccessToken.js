import HttpStatuses from 'http-status-codes';

import ApiError from '../../../modules/errors/ApiError';
import NotFoundError from '../../../modules/errors/NotFoundError';
import basicAuth from '../../../modules/authentication/basic';
import accessTokenRepository from '../../../modules/users/accessTokenRepository';

export async function createToken(request, response) {
  let user;
  let token;

  try {
    try {
      user = await basicAuth(request, response);
      token = await user.getAccessToken();
    } catch (error) {
      throw new ApiError(
        HttpStatuses.UNAUTHORIZED,
        'Authentication is required to access this resource.'
      );
    }

    response.json({
      token: token.value,
      userId: user.id,
    });
  } catch (error) {
    let apiError = error;

    if (!(error instanceof ApiError)) {
      apiError = new ApiError(HttpStatuses.INTERNAL_SERVER_ERROR, error.message);
    }

    response
      .status(apiError.statusCode)
      .json(apiError.json);
  }
}

export async function getToken(request, response) {
  let token;
  let user;

  try {
    try {
      token = await accessTokenRepository.getByValue(request.params.token);
      user = await token.getUser();
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ApiError(HttpStatuses.NOT_FOUND, 'Token not found.');
      }

      throw new ApiError(HttpStatuses.INTERNAL_SERVER_ERROR, error.message);
    }

    response.json({
      token: token.value,
      userId: user.id,
    });
  } catch (error) {
    let apiError = error;

    if (!(error instanceof ApiError)) {
      apiError = new ApiError(HttpStatuses.INTERNAL_SERVER_ERROR, error.message);
    }

    response
      .status(apiError.statusCode)
      .json(apiError.json);
  }
}

/**
 * @namespace UserAccessTokenController
 */
export default {
  createToken,
  getToken,
};
