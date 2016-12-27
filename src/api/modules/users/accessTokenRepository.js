import db from '../../db';
import NotFoundError from '../errors/NotFoundError';
import AccessToken from './AccessToken';

/**
 * Handles persistence and retrieval for access tokens.
 */
class AccessTokenRepository {
  /**
   * @param  {String} value value of the token to search for
   * @return {Promise.<AccessToken>}
   * @throws {NotFoundError} If the token isn't found
   */
  async getByValue(value) {
    const token = await db.UserAccessToken.findOne({
      where: {
        value: value,
      },
    });

    if (!token) {
      throw new NotFoundError('Token not found.');
    }

    return new AccessToken(token);
  }
}

export default new AccessTokenRepository();
