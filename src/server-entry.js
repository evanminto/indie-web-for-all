const express = require('express');
const vueServerRenderer = require('vue-server-renderer');

const vm = require('./vue/app');
const baseTemplate = require('./templates/base.html');
const config = require('../config/config');

process.env.VUE_ENV = 'server';

const app = express();
const vueRenderer = vueServerRenderer.createRenderer();

app.get('/', (request, response) => {
  vueRenderer.renderToString(vm, (error, vueHtml) => {
    if (error) {
      console.log(error);
    }

    const html = baseTemplate.replace('<div id="app"></div>', vueHtml);

    response.send(html);
  });
});

app.use('/assets', express.static('app/client'));

app.listen(config.port);
