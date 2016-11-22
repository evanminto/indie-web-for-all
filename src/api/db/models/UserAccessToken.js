import db from '../db';

db.UserAccessToken = db.sequelize.define(
  'user_access_token',
  {
    id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    value: {
      type: db.Sequelize.STRING,
      unique: true,
    },
  },
  { underscored: true }
);

export default db.UserAccessToken;
