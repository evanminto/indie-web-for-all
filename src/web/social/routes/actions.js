import activityStreamsPublisher from '../../modules/publishers/activityStreams';
import apiClient from '../../modules/api/v0/client';
import config from '../../../../config/server';

/**
 * Gets a user profile and returns it in the response.
 *
 * @memberOf SocialIndexActions
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
    const profile = await apiClient.getProfileByUsername(request.params.username);

    if (profile) {
      response.json(
        activityStreamsPublisher.publishProfile(profile)
      );
    } else {
      next();
    }
  } else {
    next();
  }
};

/**
 * Handles requests that don't match any explicit routes.
 *
 * @memberOf SocialIndexActions
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 * @param  {Function}           next
 */
export function fallback(request, response, next) {
  const acceptHeader = request.get('Accept');

  if (
    !acceptHeader ||
    acceptHeader.includes('application/ld+json; profile="https://www.w3.org/ns/activitystreams#"') ||
    acceptHeader.includes('application/activity+json')
  ) {
    response
      .status(404)
      .json({
        message: 'Route not found.',
      });
  } else {
    next();
  }
};

/**
 * Actions for use at the top level of the Social API.
 *
 * @namespace SocialIndexActions
 */
export default {
  fallback,
  getProfile,
};
