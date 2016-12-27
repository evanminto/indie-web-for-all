import Credentials from './Credentials';
import ModelProxy from '../ModelProxy';
import User from './User';

/**
 * Private account information for a @{User}.
 */
class Account extends ModelProxy {
  /**
   * @return {Credentials}
   */
  getCredentials() {
    return this.model.getCredentials()
      .then((credentials) => new Credentials(credentials));
  }

  /**
   * @return {User}
   */
  getUser() {
    return this.model.getUser()
      .then((user) => new User(user));
  }
}

export default Account;
