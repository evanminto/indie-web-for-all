import Note from './entities/Note';
import Profile from './entities/Profile';
import ProfileLink from './entities/ProfileLink';
import requestFactory from './requestFactory';

/**
 * Client for accessing the private REST API.
 */
class ApiClient {
  /**
   * Finds a profile with the specified username.
   *
   * @param  {String} username
   * @return {Promise.<Profile>}
   */
  async getProfileByUsername(username) {
    const request = requestFactory.getProfilesByUsername(username);
    const response = await fetch(request);

    if (response.ok) {
      const profiles = await response.json();

      if (!profiles.length) {
        return null;
      }

      return new Profile(profiles[0]);
    }

    return null;
  }
  /**
   * Finds the public links for a profile
   *
   * @param  {Number} id
   * @return {Promise.<ProfileLink[]>}
   */
  async getProfileLinksByProfileId(id) {
    const request = requestFactory.getProfileLinksByProfileId(id);
    const response = await fetch(request);

    if (response.ok) {
      const links = await response.json();

      return links.map(link => new ProfileLink(link));
    }

    return [];
  }

  /**
   * Creates a new note for a profile.
   *
   * @param  {Number} profileId
   * @param  {Object} data      see {@link RequestFactory#createNote}
   * @return {Note|null}
   */
  async createNote(profileId, data) {
    const request = requestFactory.createNote(profileId, data);
    const response = await fetch(request);

    if (response.ok) {
      const note = await response.json();

      return new Note(note);
    }

    return null;
  }

  async getNotesByProfileId(profileId) {
    const request = requestFactory.getNotesByProfileId(profileId);
    const response = await fetch(request);

    if (response.ok) {
      const notes = await response.json();

      return notes.map(note => new Note(note));
    }

    return [];
  }
}

export default new ApiClient();
