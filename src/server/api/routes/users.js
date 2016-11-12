import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';

import db from '../../db';
import errorPublisher from '../publishers/error';
import userPublisher from '../publishers/user';
import facade from '../../users/facade';

const router = express.Router();
const multipart = multer();

router.use(multipart.single());
// router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (request, response) => {
  facade.signUp({
    email: request.body.email,
    password: request.body.password,
  })
    .then((user) => userPublisher.publish(user))
    .then((publishedUser) => response.json(publishedUser))
    .catch((cause) => {
      response.status(409);
      response.json(errorPublisher.publishSequelizeError(cause));
    });
});

router.get('/:id', (request, response) => {
  db.UserAccount.findById(request.params.id)
    .then((account) => account.getUser())
    .then((user) => userPublisher.publish(user))
    .then((publishedUser) => response.json(publishedUser))
    .catch((cause) => {
      response.status(404);
    });
});

export default router;
