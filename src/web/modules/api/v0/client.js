import Profile from './entities/Profile';
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
}

export default new ApiClient();
