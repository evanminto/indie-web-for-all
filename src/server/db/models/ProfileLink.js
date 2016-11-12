import db from '../db';

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
  },
  { underscored: true }
);

export default db.ProfileLink;
