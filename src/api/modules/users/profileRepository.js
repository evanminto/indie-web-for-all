import db from '../../db';
import NotFoundError from '../errors/NotFoundError';
import Profile from './Profile';

class ProfileRepository {
  getByUserId(id) {
    return db.User.findById(id)
      .then((user) => {
        if (!user) {
          throw new NotFoundError({
            message: 'No user found.',
          });
        }

        console.log(user);

        return user.getProfile({
          include: [db.ProfileLink],
        });
      })
      .then((profile) => {

        console.log(profile);
        if (!profile) {
          profile = db.Profile.build();
          profile.setUser(selectedUser, { save: false });
        }

        return new Profile(profile);
      });
  }

  persist(profile) {
    const model = db.Profile.build({
      id: profile.id,
      user_id: profile.user.id,
      username: profile.username,
    });

    return model.save()
      .then(() => {
        profile.links.forEach((link) => {
          profileLinkRepository.persist(link);
        });
      });
  }
}

export default new ProfileRepository();
