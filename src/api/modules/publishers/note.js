/**
 * Convert [Notes]{@link Note} into a representation appropriate for the API.
 */
class NotePublisher {
  /**
   * @param  {Note} profile
   * @return {Object}
   */
  publish(note) {
    return {
      id: note.id,
      profileId: note.profile_id,
      content: note.content,
      createdAt: note.created_at,
      updatedAt: note.updated_at,
    };
  }
}

export default new NotePublisher();
