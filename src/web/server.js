import express from 'express';

import baseTemplate from './templates/base.hbs';
import social from './social';
import userAuthentication from './modules/userAuthentication';
import { app as vueApp, router as vueRouter } from './vue';

process.env.VUE_ENV = 'server';

const vueRenderer = require('vue-server-renderer').createRenderer();

const router = express.Router({
  mergeParams: true,
});

router.use(social);

router.use('/*', (request, response, next) => {
  const acceptHeader = request.get('Accept');

  if (!acceptHeader || acceptHeader.includes('text/html')) {
      if (request.cookies.user_access_token) {
        userAuthentication.continueSession(request.cookies.user_access_token);
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
  } else {
    response
      .set('Content-Type', 'text/plain')
      .send('Route not found');
  }
});

export default router;
