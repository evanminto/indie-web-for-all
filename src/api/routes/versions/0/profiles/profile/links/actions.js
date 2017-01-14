import apiErrorFactory from '../../../../../../modules/errors/factories/apiErrorFactory';
import BaseError from '../../../../../../modules/errors/BaseError';
import db from '../../../../../../db';
import NotFoundError from '../../../../../../modules/errors/NotFoundError';

/**
 * Gets all links in the user's profile.
 *
 * @memberOf ProfileActions
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
 * @namespace ProfileActions
 */
export default {
  getLinks,
};
