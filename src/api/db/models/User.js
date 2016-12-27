import db from '../db';

/**
 * A user of the service.
 *
 * @member User
 * @memberof db
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
