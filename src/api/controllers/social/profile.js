import activityStreamsPublisher from '../../modules/publishers/activityStreams';
import db from '../../db';

/**
 * Gets a user profile and returns it in the response.
 *
 * @memberOf ProfileController
 * @param  {external:Request}  request
 * @param  {external:Response} response
 */
export async function getProfile(request, response, next) {
  const acceptHeader = request.get('Accept');

  if (
    !acceptHeader ||
    acceptHeader.includes('application/ld+json; profile="https://www.w3.org/ns/activitystreams#"') ||
    acceptHeader.includes('application/activity+json')
  ) {
    const profile = await db.Profile.findOne({
      where: {
        username: request.params.username,
      },
    });

    if (profile) {
      response.json(
        activityStreamsPublisher.publishProfile(profile),
      );
    } else {
      next();
    }
  } else {
    next();
  }
}

/**
 * Actions for use at the top level of the Social API.
 *
 * @namespace ProfileController
 */
export default {
  getProfile,
};
