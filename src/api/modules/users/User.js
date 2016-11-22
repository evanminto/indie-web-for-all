import AccessToken from './AccessToken';
import ModelProxy from '../ModelProxy';

class User extends ModelProxy {
  getAccessToken() {
    return this.model.getAccessTokens()
      .then((tokens) => tokens[0])
      .then((token) => token ? new AccessToken(token) : undefined);
  }
}

export default User;
