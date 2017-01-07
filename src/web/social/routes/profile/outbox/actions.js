import apiClient from '../../../../modules/api/v0/client';

/**
 * Gets a user's outbox collection.
 *
 * @memberOf OutboxActions
 * @param  {external:Request}  request
 * @param  {external:Response} response
 */
export async function getOutbox(request, response) {
  const profile = await apiClient.getProfileByUsername(request.params.username);

  if (profile) {
    response.json({
      '@context': 'https://www.w3.org/ns/activitystreams',
      name: `${profile.username}'s Outbox`,
      summary: `A collection of all posts by ${profile.username} accessible to the current user.`,
      type: 'OrderedCollection',
      id: `http://localhost:3000/${profile.username}/outbox`,
      totalItems: 0,
      orderedItems: [],
      first: null,
      last: null,
      current: null,
    });
  } else {
    response
      .status(404)
      .json({
        message: 'User not found.',
      });
  }
}

/**
 * Actions for use at the top level of the Social API.
 *
 * @namespace OutboxActions
 */
export default {
  getOutbox,
};
