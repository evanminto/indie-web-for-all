import db from '../../db';
import NotFoundError from '../errors/NotFoundError';
import Profile from './Profile';

class ProfileRepository {
  getByUserId(id) {
    let selectedUser;

    return db.User.findById(id)
      .then((user) => {
        if (!user) {
          throw new NotFoundError({
            message: 'No user found.',
          });
        }

        return user;
      })
        .then((user) => {
          selectedUser = user;

          return user.getProfile();
        })
        .then((profile) => {
          if (!profile) {
            profile = db.Profile.build();
            profile.setUser(selectedUser, { save: false });
          }

          return profile;
        })
        .then((profile) => new Profile(profile));
  }
}

export default new ProfileRepository();
