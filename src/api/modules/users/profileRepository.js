import db from '../../db';
import NotFoundError from '../errors/NotFoundError';
import Profile from './Profile';

class ProfileRepository {
  async getByUserId(id) {
    const user = await db.User.findById(id);

    if (!user) {
      throw new NotFoundError({
        message: 'No user found.',
      });
    }

    let profile = await user.getProfile();

    if (!profile) {
      profile = await db.Profile.build();
      await profile.setUser(user, { save: false });
    }

    return new Profile(profile);
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
