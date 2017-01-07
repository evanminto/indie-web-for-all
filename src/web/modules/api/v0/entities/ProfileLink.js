/**
 * Links to other URLs associated with the user, accssible vis their profile.
 */
class ProfileLink {
  /**
   * @param  {Object} settings
   * @param  {String} settings.url
   * @param  {String} settings.name
   * @param  {String} settings.rel
   */
  constructor({ url, name, rel }) {
    this.url = url;
    this.name = name;
    this.rel = rel;
  }
}

export default ProfileLink;