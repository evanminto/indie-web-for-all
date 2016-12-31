import ModelProxy from '../ModelProxy';
import ProfileLink from './ProfileLink';

/**
 * Public-facing @{User} data.
 */
class Profile {
  /**
   * @param  {Object} data
   * @param  {Number} data.id
   * @param  {String} data.username
   */
  constructor({ id, username = '' }) {
    /**
     * @type {Number}
     */
    this.id = id;

    /**
     * @type {String}
     */
    this.username = username;

    /**
     * @type {ProfileLink[]}
     */
    this.links = [];
  }

  /**
   * @param {String} url
   * @param {String} name
   * @param {String} rel
   * @return {ProfileLink}
   */
  addLink(url, name, rel) {
    const link = new ProfileLink({
      url,
      name,
      rel,
    });

    this.links.push(link);

    return link;
  }
}

export default Profile;
