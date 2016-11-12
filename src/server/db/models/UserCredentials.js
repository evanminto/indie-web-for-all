import db from '../db';
import passwordEncoder from '../../users/passwordEncoder';

db.UserCredentials = db.sequelize.define(
  'user_credentials',
  {
    id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    hash: {
      type: db.Sequelize.STRING,
    },

    salt: {
      type: db.Sequelize.STRING,
    },

    strategy: {
      type: db.Sequelize.STRING,
    },
  },
  {
    underscored: true,
    setterMethods: {
      password(value) {
        this.salt = passwordEncoder.generateSalt();
        this.hash = passwordEncoder.generateHash(value, this.salt);
        this.strategy = 1;
      }
    },
  }
);

export default db.UserCredentials;
