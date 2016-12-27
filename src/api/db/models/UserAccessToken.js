/**
 * @external Model
 * @see http://sequelize.readthedocs.io/en/latest/api/model/
 */

import db from '../db';

/**
 * An access token allowing an API client to call the API on a @{User}'s behalf.
 *
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
