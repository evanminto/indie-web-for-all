import accepts from 'accepts';

import activityStreamsPublisher from '../../modules/publishers/activityStreams';
import config from '../../../../config/server';
import db from '../../db';
import outboxFactory from '../../../api/modules/outboxFactory';
import { ACTIVITY_JSON, ACTIVITY_STREAMS, HTML } from '../../modules/mimeTypes';

/**
 * Gets a user profile and returns it in the response.
 *
 * @memberOf ProfileController
 * @param  {external:Request}  request
 * @param  {external:Response} response
 */
export async function getProfile(request, response, next) {
  let profile;

  try {
    profile = await db.Profile.findOne({
      where: {
        username: request.params.username,
      },
    });
  } catch (error) {
    next('route');
  }

  if (!profile) {
    next('route');
  }

  let activities;
  let links;
  let outbox;

  switch (accepts(request).type([
    HTML,
    ACTIVITY_JSON,
    ACTIVITY_STREAMS,
  ])) {
    case ACTIVITY_JSON:
    case ACTIVITY_STREAMS:
      return respondAS(response, profile);

    case HTML:
    default:
      try {
        outbox = await outboxFactory.createForProfile(profile);
        links = await profile.getLinks();
        activities = await outbox.getActivities();
      } catch (error) {
        // Do nothing.
      }

      return respondHTML(response, profile, links, activities);
  }
}

function respondAS(response, profile) {
  response.json(
    activityStreamsPublisher.publishProfile(profile),
  );
}

async function respondHTML(response, profile, links, activities) {
  let publishedActivities = [];

  try {
    publishedActivities = await Promise.all(activities.map(async (activity) => {
      const object = await activity.getObject();

      if (object.type === 'Note') {
        const note = await object.getNote();

        return {
          note,
        };
      }
    }));
  } catch (error) {
    // Do nothing.
  }

  response.render('profile', {
    profile,
    activities: publishedActivities,
    links: [
      {
        rel: 'authorization_endpoint',
        href: 'https://indieauth.com/auth',
      },
      {
        rel: 'token_endpoint',
        href: 'https://tokens.indieauth.com/token',
      },
      {
        rel: 'micropub',
        href: `${config.baseUrl}/${profile.username}/micropub`,
      },
    ],
    profileLinks: links,
  });
}

/**
 * Actions for use at the top level of the Social API.
 *
 * @namespace ProfileController
 */
export default {
  getProfile,
};
