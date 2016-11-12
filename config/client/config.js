const devConfig = require('../development');
const prodConfig = require('../production');

let config = devConfig;

switch (process.env.NODE_ENV) {
  case 'development':
    config = devConfig;
    break;
  case 'production':
    config = prodConfig;
    config.port = process.env.PORT || 3000;
    break;
}

module.exports = config;
