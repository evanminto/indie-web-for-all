import express from 'express';

import baseTemplate from './templates/base.hbs';
import social from './social';
import userAuthentication from './modules/userAuthentication';
import vueApp from './vue';

process.env.VUE_ENV = 'server';

const vueRenderer = require('vue-server-renderer').createRenderer();

const router = express.Router({
  mergeParams: true,
});

router.use(social);

router.get('/*', async (request, response) => {
  const acceptHeader = request.get('Accept');

  if (!acceptHeader || acceptHeader.includes('text/html')) {
    if (request.cookies.user_access_token) {
      userAuthentication.continueSession(request.cookies.user_access_token);
    }

    vueApp.$router.push(request.path);

    try {
      await preFetchMatchedComponents(vueApp);
    } catch (error) {
      response
        .status(404)
        .set('Content-Type', 'text/html')
        .send('404. Route not found.');
      return;
    }

    vueRenderer.renderToString(vueApp, (error, vueHtml) => {
      if (error) {
        console.log('Error:', error);
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

/**
 * @param  {Vue} app
 * @return {Promise}
 */
async function preFetchMatchedComponents(app) {
  const matchedComponents = app.$router.getMatchedComponents();

  await Promise.all(matchedComponents.map(async (component) => {
    if (component.preFetch) {
      await component.preFetch(app.$store);
    }
  }));
}

export default router;
