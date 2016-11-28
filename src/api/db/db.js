import Sequelize from 'sequelize';

import config from '../../../config/server';

const sequelize = new Sequelize(config.dbUrl);

sequelize
  .authenticate()
  .then((error) => {
    console.log('Database connection has been established successfully.');
  })
  .catch((error) => {
    console.log('Unable to connect to the database:', error);
  });

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
