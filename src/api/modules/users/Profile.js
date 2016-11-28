import db from '../../db';
import ModelProxy from '../ModelProxy';
import ProfileLink from './ProfileLink';

class Profile {
  constructor({ id, username = '' }) {
    this.id = id;
    this.username = username;

    this.links = [];
  }

  /**
   * @param {String} url
   * @param {String} name
   * @param {String} rel
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
