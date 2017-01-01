/**
 * A user's profile, accessible to external clients/servers.
 */
class Profile {
  /**
   * @param  {Object} settings
   * @param  {String} settings.username
   */
  constructor({ username }) {
    this.username = username;
  }
}

export default Profile;