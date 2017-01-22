import accepts from 'accepts';

import db from '../../../api/db';
import NotFoundError from '../../../api/modules/errors/NotFoundError';
import { ACTIVITY_JSON, ACTIVITY_STREAMS, HTML } from '../../modules/mimeTypes';

/**
 * Gets a note.
 *
 * @memberOf NoteController
 * @param  {external:Request}  request
 * @param  {external:Response} response
 */
export async function getNote(request, response, next) {
  let note;
  let profile;

  try {
    profile = await getProfileByUsername(request.params.username);
    note = await db.Note.findById(request.params.noteId);
  } catch (error) {
    next('route');
  }

  if (!profile || !note) {
    next('route');
  }

  switch (accepts(request).type([
    HTML,
    ACTIVITY_JSON,
    ACTIVITY_STREAMS,
  ])) {
    case ACTIVITY_JSON:
    case ACTIVITY_STREAMS:
      return respondAS(response, profile, note);

    case HTML:
    default:
      return respondHTML(response, profile, note);
  }
}

/**
 * Responds with a note in ActivityStreams 2.0 format.
 *
 * @param  {external:Response} response
 * @param  {external:Instance} profile
 * @param  {external:Instance} note
 * @private
 */
function respondAS(response, profile, note) {
  response.json({
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: `http://localhost:3000/${profile.username}/notes/${note.id}`,
    content: note.content,
  });
}

/**
 * Responds with a note in HTML format.
 *
 * @param  {external:Response} response
 * @param  {external:Instance} profile
 * @param  {external:Instance} note
 * @private
 */
function respondHTML(response, profile, note) {
  response.render('note', {
    note,
    profile,
  });
}

/**
 * Find a user profile based on their username.
 *
 * @param  {String} username
 * @return {Promise.<external:Instance>}
 * @private
 */
async function getProfileByUsername(username) {
  const profile = await db.Profile.findOne({
    where: {
      username,
    },
  });

  if (!profile) {
    throw NotFoundError('No profile found for specified username.');
  }

  return profile;
}

/**
 * @namespace NoteController
 */
export default {
  getNote,
};
