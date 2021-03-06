import db from '../db';

/**
 * Public-facing {@link User} data.
 *
 * @member Profile
 * @memberof db
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
