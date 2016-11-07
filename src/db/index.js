import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

import config from '../../config/config';
import defineUser from './models/User';

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

db.User = defineUser(sequelize, Sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
