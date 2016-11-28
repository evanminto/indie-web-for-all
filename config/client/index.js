const devConfig = require('./development');
const testConfig = require('./test');
const prodConfig = require('./production');

switch (process.env.NODE_ENV) {
  case 'development':
    config = devConfig;
    break;
  case 'test':
    config = testConfig;
    break;
  case 'production':
    config = prodConfig;
    break;
}

module.exports = config;
