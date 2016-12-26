import Sequelize from 'sequelize';

import config from '../../../config/server';

const sequelizeConfig = {};

if (process.env.NODE_ENV === 'test') {
  sequelizeConfig.logging = false;
}

const sequelize = new Sequelize(config.dbUrl, sequelizeConfig);

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
