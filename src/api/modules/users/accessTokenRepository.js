import db from '../../db';
import NotFoundError from '../errors/NotFoundError';
import AccessToken from './AccessToken';

class AccessTokenRepository {
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
