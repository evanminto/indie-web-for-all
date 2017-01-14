import apiErrorFactory from '../../../../../../modules/errors/factories/apiErrorFactory';
import BaseError from '../../../../../../modules/errors/BaseError';
import db from '../../../../../../db';
import NotFoundError from '../../../../../../modules/errors/NotFoundError';
import notePublisher from '../../../../../../modules/publishers/note';

/**
 * Creates a note for the selected profile.
 *
 * @memberOf NotesActions
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 * @return {Promise}
 */
export async function createNote(request, response) {
  try {
    const profile = await db.Profile.findById(request.params.profileId);

    if (!profile) {
      throw new NotFoundError('Profile not found.');
    }

    const note = await profile.createNote({
      content: request.body.content,
    });

    response.json(notePublisher.publish(note));
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
 * Gets all notes for the selected profile.
 *
 * @memberOf NotesActions
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 * @return {Promise}
 */
export async function getNotes(request, response) {
  try {
    const profile = await db.Profile.findById(request.params.profileId);

    if (!profile) {
      throw new NotFoundError('Profile not found.');
    }

    // Get all notes, most recent first.
    const notes = await profile.getNotes({
      order: [
        ['created_at', 'DESC'],
      ],
    });

    response.json(notes.map(note => notePublisher.publish(note)));
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
 * @namespace NotesActions
 */
export default {
  createNote,
  getNotes,
};
