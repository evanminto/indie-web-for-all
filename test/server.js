import express from 'express';

import config from '../config/server';
import db from '../src/api/db';
import api from '../src/api';

const expressApp = express();

expressApp.use('/api', api);

export default function start(force = false) {
  return new Promise((resolve) => {
    db.sequelize.sync({ force })
      .then(() => expressApp.listen(config.port))
      .then(resolve);
  });
};
