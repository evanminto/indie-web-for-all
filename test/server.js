import express from 'express';

import api from '../src/api';
import config from '../config/server';
import db from '../src/api/db';

const expressApp = express();

expressApp.use(api);

export default async function start(force = false) {
  // Suppress console logging.
  console.log = () => {};

  // Start the DB connection.
  await db.sequelize.sync({ force });

  // Start the application.
  return expressApp.listen(config.port);
}
