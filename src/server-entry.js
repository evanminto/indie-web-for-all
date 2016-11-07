import express from 'express';

import baseTemplate from './templates/base.hbs';
import config from '../config/config';
import vueApp from './vue/app';

process.env.VUE_ENV = 'server';

const expressApp = express();
const vueRenderer = require('vue-server-renderer').createRenderer();

vueApp.router.beforeEach((to, from, next) => {
  if (from.fullPath) {
    next(false);
  }
});

expressApp.use('/assets', express.static('app/client'));

expressApp.get('*', (request, response) => {
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

expressApp.listen(config.port);
