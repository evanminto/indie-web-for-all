import express from 'express';

import baseTemplate from './templates/base.hbs';
import config from '../../config/config';
import vueApp from '../vue/app';
import db from './db';
import api from './api';

process.env.VUE_ENV = 'server';

const expressApp = express();
const vueRenderer = require('vue-server-renderer').createRenderer();

// Commented out to prevent redirection logic that breaks SSR.
// vueApp.router.beforeEach((to, from, next) => {
//   if (from.fullPath) {
//     next(false);
//   }
// });

expressApp.use('/assets', express.static('app/client'));

// expressApp.use('/assets', assets);
expressApp.use('/api', api);
// expressApp.get('/*', vue);

expressApp.get('/*', (request, response) => {
  vueApp.router.replace(request.path);

  vueRenderer.renderToString(vueApp.app, (error, vueHtml) => {
    if (error) {
      console.log(error);
    }

    const html = baseTemplate({
      app: vueHtml,
    });

    response.send(html);
  });
});

db.sequelize.sync({ force: true })
  .then(() => {
    expressApp.listen(config.port);
    console.log('Server running...');
  });
