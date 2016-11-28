const devConfig = require('./development');
const testConfig = require('./test');
const prodConfig = require('./production');

let config;

switch (process.env.NODE_ENV) {
  case 'development':
    config = devConfig;
    break;
  case 'test':
    config = testConfig;

    if (process.env.TEST_DB_URL && !config.dbUrl) {
      config.dbUrl = process.env.TEST_DB_URL;
    }
    break;
  case 'production':
    config = prodConfig;
    config.port = process.env.PORT || 3000;
    break;
}

if (process.env.DB_URL) {
  if (!config.dbUrl) {
    config.dbUrl = process.env.DB_URL;
  }
} else {
  throw new Error('No DB_URL or TEST_DB_URL environment variable set.');
}

module.exports = config;
