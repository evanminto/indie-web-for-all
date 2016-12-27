import AccessToken from './AccessToken';
import ModelProxy from '../ModelProxy';
import profileRepository from './profileRepository';

/**
 * A user of the service.
 */
class User extends ModelProxy {
  /**
   * @return {AccessToken}
   */
  getAccessToken() {
    return this.model.getAccessTokens()
      .then((tokens) => tokens[0])
      .then((token) => token ? new AccessToken(token) : undefined);
  }
}

export default User;
