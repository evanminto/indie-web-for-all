import db from '../db';

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
