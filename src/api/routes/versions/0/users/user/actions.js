import HttpStatuses from 'http-status-codes';

import db from '../../../../../db';
import ApiError from '../../../../../modules/errors/ApiError';
import userPublisher from '../../../../../modules/publishers/user';
import NotFoundError from '../../../../../modules/errors/NotFoundError';
import accessTokenAuth from '../../../../../modules/authentication/accessToken';

/**
 * Gets a user and returns it in the response.
 *
 * @param  {Request} request
 * @param  {Response} response
 */
export function getUser(request, response) {
  accessTokenAuth(request, response)
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
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(HttpStatuses.UNAUTHORIZED, 'You must provide a valid Bearer token.');
    })
    .catch((error) => {
      response.status(error.statusCode)
        .json(error.json);
    });
}

export default {
  getUser,
};
