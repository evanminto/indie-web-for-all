import db from '../../db';
import NotFoundError from '../errors/NotFoundError';
import User from '../users/User';

/**
 * Handles CRUD database operations for @{User} objects.
 */
class UserRepository {
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
