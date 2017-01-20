import db from '../db';

/**
 * Manages the posts intended for an actor's audience.
 */
export default class Outbox {
  /**
   * @param  {external:Instance} actor
   * @param  {external:Instance} profile
   */
  constructor(actor, profile) {
    this.actor = actor;
    this.profile = profile;
  }

  /**
   * @return {external:Instance[]}
   */
  async getActivities() {
    return this.actor.getActivities({
      order: 'created_at DESC',
    });
  }

  /**
   * @param  {Object} data
   * @param  {String} data.content
   * @return {external:Instance}
   */
  async createNote({ content }) {
    return db.sequelize.transaction(async (transaction) => {
      const activity = await this.actor.createActivity({
        type: 'Create',
        summary: `${this.profile.username} created a note.`,
      }, {
        transaction,
      });

      const activityObject = await activity.createObject({
        type: 'Note',
      }, { transaction });

      const note = await db.Note.create({
        content,
        actor_id: this.actor.id,
        object_id: activityObject.id,
      }, { transaction });

      return note;
    });
  }
}
