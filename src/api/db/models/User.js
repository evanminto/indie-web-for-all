/**
 * @external Model
 * @see http://sequelize.readthedocs.io/en/latest/api/model/
 */

import db from '../db';

/**
 * A user of the service.
 *
 * @type {external:Model}
 */
db.User = db.sequelize.define(
  'user',
  {
    id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  { underscored: true }
);

export default db.User;
