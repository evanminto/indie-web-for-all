/**
 * @external Model
 * @see http://sequelize.readthedocs.io/en/latest/api/model/
 */

import db from '../db';

/**
 * Public-facing @{User} data.
 *
 * @type {external:Model}
 */
db.Profile = db.sequelize.define(
  'profile',
  {
    id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: db.Sequelize.STRING,
      unique: true,
    },
  },
  { underscored: true }
);

export default db.Profile;
