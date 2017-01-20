/**
 * @external Instance
 * @see http://sequelize.readthedocs.io/en/latest/api/instance/
 */

import accessTokenAuth from '../../../../../../modules/authentication/accessToken';
import apiErrorFactory from '../../../../../../modules/errors/factories/apiErrorFactory';
import AuthorizationError from '../../../../../../modules/errors/AuthorizationError';
import BaseError from '../../../../../../modules/errors/BaseError';
import db from '../../../../../../db';
import profilePublisher from '../../../../../../modules/publishers/profile';
import profileRepository from '../../../../../../modules/users/profileRepository';

/**
 * Gets a {@link User}'s {@link Profile}.
 *
 * @memberOf ProfileActions
 * @function getProfile
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 * @return {Promise}
 */
export async function getProfile(request, response) {
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
 * @memberOf ProfileActions
 * @function updateProfile
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 * @return {Promise}
 */
export async function updateProfile(request, response) {
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
 * @namespace ProfileActions
 */
export default {
  getProfile,
  updateProfile,
};
