import db from '../../db';
import NotFoundError from '../errors/NotFoundError';
import Account from './Account';

/**
 * Handles persistence and retrieval for user accounts.
 */
class AccountRepository {
  getByEmail(email) {
    let selectedUser;

    return db.UserAccount.findOne({
      where: {
        email: email,
      },
    })
      .then((account) => {
        if (!account) {
          throw new NotFoundError({
            message: 'Account not found.',
          });
        }

        return account;
      })
        .then((account) => new Account(account));
  }
}

export default new AccountRepository();
