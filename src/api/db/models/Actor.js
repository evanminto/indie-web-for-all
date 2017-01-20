import db from '../db';

/**
 * An object (person, organization, etc.) that performs social actions.
 *
 * @member Actor
 * @memberof db
 * @type {external:Model}
 */
db.Actor = db.sequelize.define(
  'actor',
  {
    id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  { underscored: true },
);

export default db.Actor;
