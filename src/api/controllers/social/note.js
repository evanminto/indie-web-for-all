import db from '../../../api/db';
import NotFoundError from '../../../api/modules/errors/NotFoundError';

/**
 * Gets an activity.
 *
 * @memberOf NoteController
 * @param  {external:Request}  request
 * @param  {external:Response} response
 */
export async function getNote(request, response) {
  try {
    const profile = await db.Profile.findOne({
      where: {
        username: request.params.username,
      },
    });

    if (!profile) {
      throw NotFoundError('No profile found for specified username.');
    }

    const note = await db.Note.findById(request.params.noteId);

    if (note) {
      response.json({
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: `http://localhost:3000/${profile.username}/notes/${note.id}`,
        content: note.content,
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
 * @namespace NoteController
 */
export default {
  getNote,
};
