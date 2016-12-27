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
}

export default new Facade();
