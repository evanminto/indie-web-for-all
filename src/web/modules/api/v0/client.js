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
   * @param  {String} id
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
}

export default new ApiClient();
