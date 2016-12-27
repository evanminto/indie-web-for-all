import db from '../db';

/**
 * An access token allowing an API client to call the API on a {@link User}'s behalf.
 *
 * @member UserAccessToken
 * @memberof db
 * @type {external:Model}
 */
db.UserAccessToken = db.sequelize.define(
  'user_access_token',
  {
    id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    value: {
      type: db.Sequelize.STRING,
      unique: true,
    },
  },
  { underscored: true }
);

export default db.UserAccessToken;
