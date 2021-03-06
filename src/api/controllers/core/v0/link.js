import apiErrorFactory from '../../../modules/errors/factories/apiErrorFactory';
import BaseError from '../../../modules/errors/BaseError';
import db from '../../../db';
import NotFoundError from '../../../modules/errors/NotFoundError';

/**
 * Gets all links in the user's profile.
 *
 * @memberOf LinkController
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 * @return {Promise}
 */
export async function getLinks(request, response) {
  try {
    const profile = await db.Profile.findById(request.params.profileId);

    if (!profile) {
      throw new NotFoundError('Profile not found.');
    }

    const links = await profile.getLinks();

    response.json(links);
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
 * Gets the [ProfileLinks]{@link ProfileLink} for a {@link User}.
 *
 * @memberof ProfileController
 * @function getLinks
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 * @return {Promise}
 */
export async function getLinksByUserId(request, response) {
  try {
    const user = await db.User.findById(request.params.id);

    let profile;

    if (user) {
      profile = await user.getProfile();
    } else {
      throw new NotFoundError('User not found.');
    }

    if (!profile) {
      throw new NotFoundError('Profile not found.');
    }

    const links = await profile.getLinks();

    response.json(links);
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
 * Adds a {@link ProfileLink} to a {@link User}'s {@link Profile}.
 *
 * @memberof ProfileController
 * @function addLink
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 * @return {Promise}
 */
export function addLink(request, response) {
  db.sequelize.transaction(async (t) => {
    const user = await db.User.findById(request.params.id);

    let profile;

    if (user) {
      profile = await user.getProfile();
    } else {
      throw new NotFoundError('User not found.');
    }

    if (!profile) {
      throw new NotFoundError('Profile not found.');
    }

    const link = await db.ProfileLink.create({
      url: request.body.url,
      name: request.body.name,
      rel: request.body.rel,
    }, {
      transaction: t,
    });

    await profile.addLink(link, {
      transaction: t,
    });

    response.json({
      id: link.id,
      url: link.url,
      name: link.name,
      rel: link.rel,
    });
  });
}

/**
 * @namespace LinkController
 */
export default {
  addLink,
  getLinks,
  getLinksByUserId,
};
