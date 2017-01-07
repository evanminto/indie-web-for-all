/**
 * A user's profile, accessible to external clients/servers.
 */
class Profile {
  /**
   * @param  {Object} settings
   * @param  {Number} settings.id
   * @param  {String} settings.username
   */
  constructor({ id, username }) {
    this.id = id;
    this.username = username;
  }
}

export default Profile;
