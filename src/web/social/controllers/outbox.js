import db from '../../../api/db';
import outboxFactory from '../../../api/modules/outboxFactory';

/**
 * Gets a user's outbox collection.
 *
 * @memberOf OutboxController
 * @param  {external:Request}  request
 * @param  {external:Response} response
 */
export async function getOutbox(request, response) {
  const profile = await db.Profile.findOne({
    where: {
      username: request.params.username,
    },
  });

  const outbox = await outboxFactory.createForProfile(profile);

  if (outbox) {
    const activities = await outbox.getActivities();

    const items = activities.map(activity => `http://localhost:3000/${profile.username}/activities/${activity.id}`);

    response.json({
      '@context': 'https://www.w3.org/ns/activitystreams',
      name: `${profile.username}'s Outbox`,
      summary: `A collection of all posts by ${profile.username} accessible to the current user.`,
      type: 'OrderedCollection',
      id: `http://localhost:3000/${profile.username}/outbox`,
      totalItems: items.length,
      orderedItems: items,
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
 * @namespace OutboxController
 */
export default {
  getOutbox,
};
