import db from '../../db';
import NotFoundError from '../errors/NotFoundError';
import AccessToken from './AccessToken';

class AccessTokenRepository {
  getByValue(value) {
    return db.UserAccessToken.findOne({
      where: {
        value: value,
      },
    })
      .then((token) => {
        if (!token) {
          throw new NotFoundError({
            message: 'Token not found.',
          });
        }

        return token;
      })
        .then((token) => new AccessToken(token));
  }
}

export default new AccessTokenRepository();
