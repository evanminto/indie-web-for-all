import express from 'express';

import config from '../config/server';
import db from '../src/api/db';
import api from '../src/api';

const expressApp = express();

expressApp.use('/api', api);

export default async function start(force = false) {
  console.log = () => {};
  await db.sequelize.sync({ force });
  return expressApp.listen(config.port);
};
