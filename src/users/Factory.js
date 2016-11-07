import db from '../db';
import User from './User';

class Factory {
  /**
   * @return {Promise}
   */
  create() {
    return new Promise((resolve) => {
      db.User.sync().then(() => {
        resolve(new User(db.User.build()));
      });
    });
  }
}

export default Factory;
