import moment from 'moment';

/**
 * A short text note posted to the user's profile.
 */
class Note {
  /**
   * @param  {Object} settings
   * @param  {Number} settings.id
   * @param  {String} settings.content
   * @param  {String} settings.createdAt
   * @param  {String} settings.updatedAt
   */
  constructor({ id, content, createdAt, updatedAt }) {
    this.id = id;
    this.content = content;
    this.createdAt = moment(createdAt);
    this.updatedAt = moment(updatedAt);
    this.publishedAt = this.createdAt;
  }
}

export default Note;
