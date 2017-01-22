/**
 * @external Request
 * @see http://expressjs.com/en/api.html#req
 */

/**
 * @external Response
 * @see http://expressjs.com/en/api.html#res
 */

import 'babel-polyfill';
import express from 'express';
import cookieParser from 'cookie-parser';

import api from './api';
import config from '../config/server';
import db from './api/db';
import hbs from './api/handlebars';
import web from './web/server';

const expressApp = express();

expressApp.engine('.hbs', hbs.engine);
expressApp.set('view engine', '.hbs');
expressApp.set('views', 'src/api/views/');

expressApp.use(cookieParser());

expressApp.use('/assets', express.static('app/client'));
expressApp.use(api);
expressApp.use(web);

// Start the application.
(async () => {
  await db.sequelize.sync({ force: false });
  expressApp.listen(config.port);

  if (process.env.NODE_ENV !== 'test') {
    console.log('Server running...');
  }
})();
