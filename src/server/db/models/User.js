import db from '../db';

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
