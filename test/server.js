import express from 'express';

const mockTemplate = jest.fn();
mockTemplate.mockImplementation(() => '');

const api = require('../src/api').default;
const config = require('../config/server');
const db = require('../src/api/db').default;

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
