import Account from './Account';
import ModelProxy from '../ModelProxy';
import passwordEncoder from './passwordEncoder';

class Credentials extends ModelProxy {
  passwordMatches(password) {
    const hash = passwordEncoder.generateHash(password, this.model.salt);

    return hash === this.model.hash;
  }

  getAccount() {
    return this.model.getAccount()
      .then((account) => new Account(account));
  }
}

export default Credentials;
