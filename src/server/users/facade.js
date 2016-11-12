import db from '../db';

class Facade {
  signUp({ email, password }) {
    let newUser;

    return db.sequelize.transaction((t) => {
      return db.User.create({}, {
        transaction: t,
      })
        .then((user) => {
          newUser = user;

          return user.createAccount({
            email: email,
          }, {
            transaction: t,
          });
        })
        .then((account) => {
          return account.createCredentials({
            password: password,
          }, {
            transaction: t,
          });
        })
        .then(() => newUser);
    });
  }
}

export default new Facade();
