import db from '../db';

/**
 * A generic social action.
 *
 * @member Activity
 * @memberof db
 * @type {external:Model}
 */
db.Activity = db.sequelize.define(
  'activity',
  {
    id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    summary: {
      type: db.Sequelize.STRING,
    },

    type: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
  },
  { underscored: true },
);

export default db.Activity;
