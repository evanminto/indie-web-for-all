import db from '../../db';
import AccessToken from './AccessToken';

class Facade {
  async signUp({ email, password }) {
    let newUser;

    try {
      return db.sequelize.transaction(async (transaction) => {
        const user = await db.User.create({}, {
          transaction,
        });

        const account = await user.createAccount({
          email,
        }, {
          transaction,
        });

        await account.createCredentials({
          password,
        }, {
          transaction,
        });

        const profile = await user.createProfile({}, {
          transaction,
        });

        await profile.createActor({}, {
          transaction,
        });

        const tokenModel = await user.createAccessToken({
          value: 'asdf',
        }, {
          transaction,
        });

        const token = new AccessToken(tokenModel);

        token.refresh();

        await token.save({
          transaction,
        });

        return user;
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default new Facade();
