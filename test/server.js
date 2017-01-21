import express from 'express';

const mockTemplate = jest.fn();
mockTemplate.mockImplementation(() => '');

jest.mock('../src/web/templates/baseSync.hbs', () => mockTemplate);
jest.mock('../src/web/templates/note.hbs', () => mockTemplate);
jest.mock('../src/web/templates/profile.hbs', () => mockTemplate);

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
