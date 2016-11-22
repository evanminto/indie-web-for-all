import HttpStatuses from 'http-status-codes';

import db from '../../../../../db';
import ApiError from '../../../../../modules/errors/ApiError';
import AuthorizationError from '../../../../../modules/errors/AuthorizationError';
import userPublisher from '../../../../../modules/publishers/user';
import profilePublisher from '../../../../../modules/publishers/profile';
import profileRepository from '../../../../../modules/users/profileRepository';
import NotFoundError from '../../../../../modules/errors/NotFoundError';
import ValidationError from '../../../../../modules/errors/ValidationError';
import accessTokenAuth from '../../../../../modules/authentication/accessToken';

/**
 * Gets a user and returns it in the response.
 *
 * @param  {Request} request
 * @param  {Response} response
 */
function getUser(request, response) {
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

/**
 * Gets a user profile and returns it in the response.
 *
 * @param  {Request} request
 * @param  {Response} response
 */
function getProfile(request, response) {
  profileRepository.getByUserId(request.params.id)
    .then((profile) => profilePublisher.publish(profile))
    .then((publishedProfile) => response.json(publishedProfile))
    .catch((error) => {
      if (error instanceof NotFoundError) {
        throw new ApiError(HttpStatuses.NOT_FOUND, 'Profile not found.');
      }

      throw new ApiError(HttpStatuses.INTERNAL_SERVER_ERROR, error.message);
    })
    .catch((error) => {
      response.status(error.statusCode)
        .json(error.json);
    });
}

/**
 * Updates a user profile based on a provided request and response.
 *
 * @param  {Request} request
 * @param  {Response} response
 */
function updateProfile(request, response) {
  accessTokenAuth(request, response)
    .then((user) => {
      db.User.findById(request.params.id)
        .then((selectedUser) => checkUserMatch(user, selectedUser))
        .then(() => profileRepository.getByUserId(request.params.id))
        .then((profile) => checkUsernameField(profile, request))
        .then((profile) => setUsernameField(profile, request))
        .then((profile) => profile.save())
        .then((profile) => profilePublisher.publish(profile))
        .then((publishedProfile) => response.json(publishedProfile))
        .catch((error) => {
          if (error instanceof ValidationError) {
            throw new ApiError(HttpStatuses.BAD_REQUEST, 'Something is wrong with your request.');
          }

          if (error instanceof NotFoundError) {
            throw new ApiError(HttpStatuses.NOT_FOUND, 'Profile not found.');
          }

          throw new ApiError(HttpStatuses.INTERNAL_SERVER_ERROR, error.message);
        });
    })
    .catch((error) => {
      throw new ApiError(HttpStatuses.UNAUTHORIZED, 'You must provide a valid Bearer token.');
    })
    .catch((error) => {
      response.status(error.statusCode)
        .json(error.json);
    });
}

/**
 * Checks if the two users match and returns them if they do.
 *
 * @param  {User} user1
 * @param  {User} user2
 * @return {User}
 * @throws {AuthorizationError} If the users don't match
 */
function checkUserMatch(user1, user2) {
  if (!user1 || !user2 || user1.id !== user2.id) {
    throw new AuthorizationError('Wrong user.');
  }

  return user1;
}

/**
 * Checks if a username field was provided in the request and returns the profile.
 *
 * @param  {Profile} profile
 * @param  {Request} request
 * @return {Profile}
 * @throws {ValidationError} If the username field isn't provided
 */
function checkUsernameField(profile, request) {
  if (!request.body.username) {
    throw new ValidationError('No username field provided.');
  }

  return profile;
}

/**
 * Sets username for the profile based on the request body.
 *
 * @param {Profile} profile
 * @param {Request} request
 */
function setUsernameField(profile, request) {
  profile.username = request.body.username;

  return profile;
}

export default {
  getUser,
  getProfile,
  updateProfile,
};
