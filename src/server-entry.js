import 'babel-polyfill';
import express from 'express';
import cookieParser from 'cookie-parser';

import baseTemplate from './web/templates/base.hbs';
import config from '../config/server';
import { app as vueApp, router as vueRouter } from './web/vue';
import currentSession from './web/modules/currentSession';
import db from './api/db';
import api from './api';

process.env.VUE_ENV = 'server';

const expressApp = express();
const vueRenderer = require('vue-server-renderer').createRenderer();

expressApp.use(cookieParser());

expressApp.use('/assets', express.static('app/client'));

// expressApp.use('/assets', assets);
expressApp.use('/api', api);
// expressApp.get('/*', vue);

expressApp.get('/*', (request, response) => {
  if (request.cookies.user_id && request.cookies.user_access_token) {
    currentSession.useCredentials(request.cookies.user_id, request.cookies.user_access_token);
  }

  // Causing a problem now?
  // vueRouter.replace(request.path);

  vueRenderer.renderToString(vueApp, (error, vueHtml) => {
    if (error) {
      console.log(error);
    }

    const html = baseTemplate({
      app: vueHtml,
    });

    response
      .set('Content-Type', 'text/html')
      .send(html);
  });
});

(async () => {
  await db.sequelize.sync({ force: false });
  expressApp.listen(config.port);

  console.log('Server running...');
})();
