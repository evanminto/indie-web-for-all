import crypto from 'crypto';

import ModelProxy from '../ModelProxy';
import User from './User';

class AccessToken extends ModelProxy {
  get value() {
    return this.model.value;
  }

  refresh() {
    const secret = crypto.randomBytes(8);
    const source = crypto.randomBytes(32);

    const hash = crypto.createHmac('sha1', secret);

    hash.update(source);

    this.model.value = hash.digest('hex');
  }

  getUser() {
    return this.model.getUser()
      .then((user) => new User(user));
  }
}

export default AccessToken;
