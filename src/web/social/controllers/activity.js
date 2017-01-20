import db from '../../../api/db';
import NotFoundError from '../../../api/modules/errors/NotFoundError';

/**
 * Gets an activity.
 *
 * @memberOf ActivityController
 * @param  {external:Request}  request
 * @param  {external:Response} response
 */
export async function getActivity(request, response) {
  try {
    const profile = await db.Profile.findOne({
      where: {
        username: request.params.username,
      },
    });

    if (!profile) {
      throw NotFoundError('No profile found for specified username.');
    }

    const activity = await db.Activity.findById(request.params.activityId);

    if (!activity) {
      throw NotFoundError('Activity not found.');
    }

    const object = await activity.getObject();
    let note;

    if (object.type === 'Note') {
      note = await object.getNote();
    }

    if (activity) {
      response.json({
        '@context': 'https://www.w3.org/ns/activitystreams',
        type: activity.type,
        id: `http://localhost:3000/${profile.username}/activities/${activity.id}`,
        object: `http://localhost:3000/${profile.username}/notes/${note.id}`,
        summary: activity.summary,
      });

      return;
    }
  } catch (error) {
    response
      .status(404)
      .json({
        message: 'Not found.',
      });
  }
}

/**
 * @namespace ActivityController
 */
export default {
  getActivity,
};
