import accessTokenAuth from '../../../modules/authentication/accessToken';
import apiErrorFactory from '../../../modules/errors/factories/apiErrorFactory';
import AuthorizationError from '../../../modules/errors/AuthorizationError';
import BaseError from '../../../modules/errors/BaseError';
import db from '../../../db';
import profilePublisher from '../../../modules/publishers/profile';
import profileRepository from '../../../modules/users/profileRepository';

/**
 * Gets all profiles matching the provided filters and returns them in the response.
 *
 * @memberOf ProfileController
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 * @return {Promise}
 */
export async function getProfiles(request, response) {
  let profiles = [];

  if (request.query.username) {
    profiles = await db.Profile.findAll({
      where: {
        username: request.query.username,
      },
    });
  }

  if (!profiles) {
    profiles = [];
  }

  response.json(
    profiles.map(profile => profilePublisher.publish(profile)),
  );
}

/**
 * Gets a {@link User}'s {@link Profile}.
 *
 * @memberOf ProfileController
 * @function getProfile
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 * @return {Promise}
 */
export async function getProfileByUserId(request, response) {
  try {
    const profile = await profileRepository.getByUserId(request.params.id);
    const publishedProfile = profilePublisher.publish(profile);

    response.json(publishedProfile);
  } catch (error) {
    let apiError;

    if (error instanceof BaseError) {
      apiError = apiErrorFactory.createFromBaseError(error);
    } else {
      apiError = apiErrorFactory.createFromMessage(error);
    }

    response.status(apiError.statusCode)
      .json(apiError.json);
  }
}

/**
 * Updates a {@link User}'s {@link Profile}.
 *
 * @memberOf ProfileController
 * @function updateProfile
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 * @return {Promise}
 */
export async function updateProfileByUserId(request, response) {
  try {
    const currentUser = await accessTokenAuth(request, response);
    const user = await db.User.findById(request.params.id);

    if (!usersMatch(currentUser.model, user)) {
      throw new AuthorizationError("User doesn't match.");
    }

    const profile = await user.getProfile();

    profile.username = request.body.username;

    await db.sequelize.transaction(async (transaction) => {
      await profile.save({ transaction });
    });

    const publishedProfile = await profilePublisher.publish(profile);

    response.json(publishedProfile);
  } catch (error) {
    let apiError;

    if (error instanceof BaseError) {
      apiError = apiErrorFactory.createFromBaseError(error);
    } else {
      apiError = apiErrorFactory.createFromMessage(error);
    }

    response
      .status(apiError.statusCode)
      .json(apiError.json);
  }
}

/**
 * @param  {external:Instance} user1
 * @param  {external:Instance} user2
 * @return {Boolean}
 * @private
 */
function usersMatch(user1, user2) {
  if (!user1 || !user2 || user1.id !== user2.id) {
    return false;
  }

  return true;
}

/**
 * @namespace ProfileController
 */
export default {
  getProfiles,
  getProfileByUserId,
  updateProfileByUserId,
};
