import HttpStatuses from 'http-status-codes';

import accessTokenAuth from '../../../modules/authentication/accessToken';
import ApiError from '../../../modules/errors/ApiError';
import apiErrorFactory from '../../../modules/errors/factories/apiErrorFactory';
import BaseError from '../../../modules/errors/BaseError';
import db from '../../../db';
import facade from '../../../modules/users/facade';
import NotFoundError from '../../../modules/errors/NotFoundError';
import userPublisher from '../../../modules/publishers/user';

export function createUser(request, response) {
  return facade.signUp({
    email: request.body.email,
    password: request.body.password,
  })
    .then((user) => userPublisher.publish(user, { accessToken: true }))
    .then((publishedUser) => response.status(HttpStatuses.CREATED).json(publishedUser))
    .catch((error) => {
      let apiError;

      if (error instanceof db.Sequelize.Error) {
        throw apiErrorFactory.createFromSequelizeError(error);
      } else if (error instanceof BaseError) {
        apiError = apiErrorFactory.createFromBaseError(error);
      } else {
        apiError = apiErrorFactory.createFromMessage(error);
      }

      response.status(apiError.statusCode)
        .json(apiError.json);
    });
}

/**
 * Gets a user and returns it in the response.
 *
 * @memberOf UserController
 * @function getUser
 * @param  {external:Request} request
 * @param  {external:Response} response
 */
export function getUser(request, response) {
  return accessTokenAuth(request, response)
    .then((user) => {
      db.User.findById(request.params.id)
        .then((selectedUser) => {
          if (selectedUser.id !== user.id) {
            throw { message: 'Wrong user.' };
          }

          return selectedUser;
        })
        .then((user) => userPublisher.publish(user))
        .then((publishedUser) => response.json(publishedUser))
        .catch((error) => {
          if (error instanceof NotFoundError) {
            throw new ApiError(HttpStatuses.NOT_FOUND, 'User not found.');
          }

          throw new ApiError(HttpStatuses.INTERNAL_SERVER_ERROR, error.message);
        });
    })
    .catch((error) => {
      let apiError;

      if (error instanceof BaseError) {
        apiError = apiErrorFactory.createFromBaseError(error);
      } else {
        apiError = apiErrorFactory.createFromMessage(error);
      }

      response.status(apiError.statusCode)
        .json(apiError.json);
    });
}

/**
 * @namespace UserController
 */
export default {
  getUser,
};
