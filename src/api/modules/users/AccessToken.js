import crypto from 'crypto';

import ModelProxy from '../ModelProxy';
import User from './User';

/**
 * An access token allowing an API client to call the API on a @{User}'s behalf.
 */
class AccessToken extends ModelProxy {
  /**
   * @type {String}
   * @readOnly
   */
  get value() {
    return this.model.value;
  }

  /**
   * Changes the access token.
   */
  refresh() {
    const secret = crypto.randomBytes(8);
    const source = crypto.randomBytes(32);

    const hash = crypto.createHmac('sha1', secret);

    hash.update(source);

    this.model.value = hash.digest('hex');
  }

  /**
   * @return {User}
   */
  getUser() {
    return this.model.getUser()
      .then((user) => new User(user));
  }
}

export default AccessToken;
