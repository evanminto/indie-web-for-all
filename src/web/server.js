import express from 'express';

import baseTemplate from './templates/base.hbs';
import socialRouter from './social';
import userAuthentication from './modules/userAuthentication';
import vueApp from './vue';

process.env.VUE_ENV = 'server';

const vueRenderer = require('vue-server-renderer').createRenderer();

const router = express.Router({
  mergeParams: true,
});

router.use(socialRouter);

router.get('/*', async (request, response) => {
  const acceptHeader = request.get('Accept');

  if (
      !acceptHeader ||
      acceptHeader.includes('*/*') ||
      acceptHeader.includes('text/html')
    ) {
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

      const htmlHead = getHtmlHeadFromMatchedComponents(vueApp);

      const html = baseTemplate({
        app: vueHtml,
        links: htmlHead.links,
        metas: htmlHead.metas,
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

/**
 * @param  {Vue} app
 * @return {Object}
 */
function getHtmlHeadFromMatchedComponents(app) {
  const matchedComponents = app.$router.getMatchedComponents();

  return matchedComponents.reduce((result, component) => {
    if (component.htmlHead) {
      if (component.htmlHead.links) {
        result.links = result.links.concat(component.htmlHead.links);
      }

      if (component.htmlHead.metas) {
        result.metas = result.metas.concat(component.htmlHead.metas);
      }
    }

    return result;
  }, {
    links: [],
    metas: [],
  });
}

export default router;
