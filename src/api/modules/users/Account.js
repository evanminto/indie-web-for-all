import Credentials from './Credentials';
import ModelProxy from '../ModelProxy';
import User from './User';

class Account extends ModelProxy {
  getCredentials() {
    return this.model.getCredentials()
      .then((credentials) => new Credentials(credentials));
  }

  getUser() {
    return this.model.getUser()
      .then((user) => new User(user));
  }
}

export default Account;
