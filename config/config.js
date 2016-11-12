const devConfig = require('./development');
const prodConfig = require('./production');

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

if (process.env.DB_URL) {
  config.dbUrl = process.env.DB_URL;
} else {
  throw new Error('No DB_URL environment variable set.');
}

module.exports = config;
