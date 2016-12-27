import Account from './Account';
import ModelProxy from '../ModelProxy';
import passwordEncoder from './passwordEncoder';

/**
 * Login credentials for a @{User}.
 */
class Credentials extends ModelProxy {
  /**
   * Checks if the provided password matches the one stored in the DB.
   *
   * @param  {String} password
   * @return {Boolean}
   */
  passwordMatches(password) {
    const hash = passwordEncoder.generateHash(password, this.model.salt);

    return hash === this.model.hash;
  }

  /**
   * @return {Account}
   */
  getAccount() {
    return this.model.getAccount()
      .then((account) => new Account(account));
  }
}

export default Credentials;
