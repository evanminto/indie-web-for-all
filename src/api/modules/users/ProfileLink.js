import ModelProxy from '../ModelProxy';

/**
 * Links to other pages representing or related to the user.
 */
class ProfileLink {
  /**
   * @param  {Object} data
   * @param  {String} data.url
   * @param  {String} data.name
   * @param  {String} data.rel
   */
  constructor({ url, name, rel }) {
    /**
     * @type {String}
     */
    this.url = url;

    /**
     * @type {String}
     */
    this.name = name;

    /**
     * @type {String}
     */
    this.rel = rel;
  }
}

export default ProfileLink;
