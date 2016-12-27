/**
 * @external Model
 * @see http://sequelize.readthedocs.io/en/latest/api/model/
 */

import db from '../db';

/**
 * Private account information for a @{User}.
 *
 * @type {external:Model}
 */
db.UserAccount = db.sequelize.define(
  'user_account',
  {
    id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    email: {
      type: db.Sequelize.STRING,
      unique: true,
    },
  },
  { underscored: true }
);

export default db.UserAccount;
