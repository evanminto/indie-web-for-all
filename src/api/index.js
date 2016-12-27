import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';

import v0 from './routes/versions/0';

const router = express.Router({
  mergeParams: true,
});
const multipart = multer();

router.use(multipart.single());
router.use(bodyParser.urlencoded({ extended: true }));

router.use('/v0', v0);

// Return 404 response when the API doesn't recognize a route.
router.all('/*', (request, response) => {
  response.status(404);
  response.json({
    message: 'Route not found.',
  });
});

export default router;
