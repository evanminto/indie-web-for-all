import express from 'express';

import api from '../src/api';
import config from '../config/server';
import db from '../src/api/db';
import social from '../src/web/social';

const expressApp = express();

expressApp.use('/api', api);
expressApp.use(social);

export default async function start(force = false) {
  // Suppress console logging.
  console.log = () => {};

  // Start the DB connection.
  await db.sequelize.sync({ force });

  // Start the application.
  return expressApp.listen(config.port);
}
