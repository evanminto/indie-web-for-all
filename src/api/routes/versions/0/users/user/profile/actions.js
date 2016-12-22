import HttpStatuses from 'http-status-codes';

import db from '../../../../../../db';
import ApiError from '../../../../../../modules/errors/ApiError';
import AuthorizationError from '../../../../../../modules/errors/AuthorizationError';
import profilePublisher from '../../../../../../modules/publishers/profile';
import profileRepository from '../../../../../../modules/users/profileRepository';
import NotFoundError from '../../../../../../modules/errors/NotFoundError';
import ValidationError from '../../../../../../modules/errors/ValidationError';
import accessTokenAuth from '../../../../../../modules/authentication/accessToken';

/**
 * Gets a user profile and returns it in the response.
 *
 * @param  {Request} request
 * @param  {Response} response
 */
export async function getProfile(request, response) {
  try {
    const profile = await profileRepository.getByUserId(request.params.id);
    const publishedProfile = profilePublisher.publish(profile);

    response.json(publishedProfile);
  } catch (error) {
    let apiError;

    if (error instanceof NotFoundError) {
      apiError = new ApiError(HttpStatuses.NOT_FOUND, 'Profile not found.');
    }

    apiError = new ApiError(HttpStatuses.INTERNAL_SERVER_ERROR, error.message);

    response.status(apiError.statusCode)
      .json(apiError.json);
  }
}

/**
 * Updates a user profile based on a provided request and response.
 *
 * @param  {Request} request
 * @param  {Response} response
 */
export function updateProfile(request, response) {
  accessTokenAuth(request, response)
    .then((currentUser) => {
      return db.sequelize.transaction((transaction) => {
        return db.User.findById(request.params.id)
          .then(checkUserMatches(currentUser.model))
          .then(getProfile2(transaction))
          .then(setUsernameFromRequest(request))
          .then((profile) => profile.save({transaction}))
          .then(addLinksFromRequest(request, transaction))
      })
        .then((profile) => profilePublisher.publish(profile))
        .then((publishedProfile) => response.json(publishedProfile))
        .catch((error) => {
          if (error instanceof ValidationError) {
            throw new ApiError(HttpStatuses.BAD_REQUEST, error.message);
          }

          if (error instanceof NotFoundError) {
            throw new ApiError(HttpStatuses.NOT_FOUND, 'Profile not found.');
          }

          throw new ApiError(HttpStatuses.INTERNAL_SERVER_ERROR, error.message);
        });
    })
    .catch((error) => {
      if (!(error instanceof ApiError)) {
        throw new ApiError(HttpStatuses.UNAUTHORIZED, 'You must provide a valid Bearer token.');
      }

      throw error;
    })
    .catch((error) => {
      response.status(error.statusCode)
        .json(error.json);
    });
}

/**
 * Checks if the two users match and returns them if they do.
 *
 * @param  {User} expectedUser
 * @return {Function}
 */
function checkUserMatches(expectedUser) {
  /**
   * @param  {User} user
   * @return {User}
   * @throws {AuthorizationError} If the users don't match
   */
  return function check(user) {
    if (!user || !expectedUser || user.id !== expectedUser.id) {
      throw new AuthorizationError('Wrong user.');
    }

    return user;
  }
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

function getProfile2(transaction) {
  return function findOrCreateProfile(user) {
    return user.getProfile()
      .then((profile) => {
        if (!profile) {
          const newProfile = db.Profile.build();

          newProfile.setUser(user, {transaction, save: false})

          return newProfile;
        }

        return profile;
      });
  }
}

/**
 * Sets username for the profile based on the request body.
 *
 * @param {Request} request
 */
function setUsernameFromRequest(request) {
  /**
   * @param {Profile} profile
   */
  return function setUsername(profile) {
    profile.username = request.body.username;

    return profile;
  };
}

/**
 * @param {Request} request
 * @param {Transaction} transaction
 */
function addLinksFromRequest(request, transaction) {
  /**
   * @param {Profile} profile
   */
  return function addLinks(profile) {
    if (request.body.links) {
      const promises = [];

      profile.getLinks()
        .then((existingLinks) => {
          request.body.links.forEach((link) => {
            if (existingLinks.includes(link)) {
              promises.push(
                db.ProfileLink.create({
                  url: link.url,
                  name: link.name,
                  rel: link.rel,
                }, {transaction})
              );
            }

          });
        });

      return Promise.all(promises)
        .then((links) => profile.setLinks(links, {transaction}))
        .then(() => profile);
    }

    return profile;
  };
}

export default {
  getProfile,
  updateProfile,
};
