import db from '../db';

/**
 * Links to other pages representing or related to the user.
 */
db.ProfileLink = db.sequelize.define(
  'profile_link',
  {
    id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    url: {
      type: db.Sequelize.STRING,
    },

    name: {
      type: db.Sequelize.STRING,
    },

    rel: {
      type: db.Sequelize.STRING,
      default: 'me',
    }
  },
  { underscored: true }
);

export default db.ProfileLink;
