/**
 * @external Request
 * @see http://expressjs.com/en/api.html#req
 */

/**
 * @external Response
 * @see http://expressjs.com/en/api.html#res
 */

/**
 * @external Instance
 * @see http://sequelize.readthedocs.io/en/latest/api/instance/
 */

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
 * Gets a {@link User}'s {@link Profile}.
 *
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
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 * @return {Promise}
 */
export async function updateProfile(request, response) {
  try {
    const currentUser = await accessTokenAuth(request, response);

    const profile = await db.sequelize.transaction(async (transaction) => {
      const userModel = await db.User.findById(request.params.id);

      if (!usersMatch(currentUser.model, userModel)) {
        throw new AuthorizationError("User doesn't match.");
      }

      const profileModel = await getOrCreateProfileForUser(userModel);

      profileModel.username = request.body.username;
      await profileModel.save({transaction});

      return profileModel;
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

    response.status(apiError.statusCode)
      .json(apiError.json);
  }
}

/**
 * @param  {external:Instance} user1
 * @param  {external:Instance} user2
 * @return {Boolean}
 */
function usersMatch(user1, user2) {
  if (!user1 || !user2 || user1.id !== user2.id) {
    return false;
  }

  return true;
}

/**
 * @param  {external:Instance} user
 * @return {external:Instance} the user's existing profile, or a new one
 */
async function getOrCreateProfileForUser(user) {
  const profileModel = await user.getProfile();

  if (!profileModel) {
    const newProfile = db.Profile.build();

    newProfile.setUser(user, {transaction, save: false})

    return newProfile;
  }

  return profileModel;
}

export default {
  getProfile,
  updateProfile,
};
