import db from '../../db';
import NotFoundError from '../errors/NotFoundError';
import User from '../users/User';

/**
 * Handles CRUD database operations for {@link User} objects.
 */
class UserRepository {
  /**
   * @param  {Number} id
   * @return {User}
   */
  getById(id) {
    return db.User.findById(id)
      .then((user) => {
        if (!user) {
          throw new NotFoundError({
            message: 'No user found.',
          });
        }

        return user;
      })
      .then((user) => new User(user));
  }
}

export default new UserRepository();
