import db from '../../db';
import AccessToken from './AccessToken';
import NotFoundError from '../errors/NotFoundError';
import ValidationError from '../errors/ValidationError';

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
        .then(() => {
          return newUser.createProfile({}, {
            transaction: t,
          });
        })
        .then(() => {
          return newUser.createAccessToken({
            value: 'asdf',
          }, {
            transaction: t,
          });
        })
        .then((tokenModel) => {
          const token = new AccessToken(tokenModel);

          token.refresh();

          return token.save({
            transaction: t,
          });
        })
        .then(() => newUser);
    });
  }

  setUsername({ userId, username }) {
    let selectedUser;

    return db.sequelize.transaction((t) => {
      return db.User.findById(userId)
        .then((user) => {
          selectedUser = user;

          if (!user) {
            throw new NotFoundError({
              message: 'No user found.',
            });
          }

          if (!username) {
            throw new ValidationError({
              message: 'No username field provided.'
            });
          }

          return user.createProfile({
            username: username,
          }, {
            transaction: t,
          });
        })
        .then(() => selectedUser);
    });
  }
}

export default new Facade();
