const devConfig = require('../config/development');
const prodConfig = require('../config/production');

let config;

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
