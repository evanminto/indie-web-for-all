import accepts from 'accepts';

import activityStreamsPublisher from '../../modules/publishers/activityStreams';
import config from '../../../../config/server';
import db from '../../db';
import baseSyncTemplate from '../../../web/templates/baseSync.hbs';
import profileTemplate from '../../../web/templates/profile.hbs';
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

  let links;

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
        links = await profile.getLinks();
      } catch (error) {
        // Do nothing.
      }

      return respondHTML(response, profile, links);
  }
}

function respondAS(response, profile) {
  response.json(
    activityStreamsPublisher.publishProfile(profile),
  );
}

function respondHTML(response, profile, links) {
  const html = baseSyncTemplate({
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

    body: profileTemplate({
      profile,
      links,
    }),
  });

  response
    .set('Content-Type', HTML)
    .send(html);
}

/**
 * Actions for use at the top level of the Social API.
 *
 * @namespace ProfileController
 */
export default {
  getProfile,
};
