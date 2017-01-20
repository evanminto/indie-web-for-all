import db from '../db';
import NotFoundError from './errors/NotFoundError';
import Outbox from './Outbox';

/**
 * Generates {@link Outbox} objects based on parameters.
 */
class OutboxFactory {
  /**
   * @param  {String} username
   * @return {Outbox}
   */
  async createForUsername(username) {
    const profile = await db.Profile.findOne({
      where: {
        username,
      },
    });

    if (!profile) {
      throw NotFoundError('No profile found for specified username.');
    }

    return this.createForProfile(profile);
  }

  /**
   * @param  {external:Instance} profile
   * @return {Outbox}
   */
  async createForProfile(profile) {
    const actor = await profile.getActor();

    return new Outbox(actor, profile);
  }
}

export default new OutboxFactory();
