import expressHandlebars from 'express-handlebars';

import timestamp from './helpers/timestamp';

export default expressHandlebars.create({
  defaultLayout: 'base',
  extname: '.hbs',
  helpers: {
    timestamp,
  },
  layoutsDir: 'src/api/views/layouts/',
  partialsDir: 'src/api/views/partials/',
});
