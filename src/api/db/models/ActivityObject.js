import db from '../db';

/**
 * An object that activities can act on.
 *
 * @member ActivityObject
 * @memberof db
 * @type {external:Model}
 */
db.ActivityObject = db.sequelize.define(
  'activity_object',
  {
    id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    type: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
  },
  { underscored: true },
);

export default db.ActivityObject;
