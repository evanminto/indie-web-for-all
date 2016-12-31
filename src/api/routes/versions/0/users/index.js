import express from 'express';
import HttpStatuses from 'http-status-codes';

import db from '../../../../db';
import userRouter from './user';
import ApiError from '../../../../modules/errors/ApiError';
import BaseError from '../../../../modules/errors/BaseError';
import NotFoundError from '../../../../modules/errors/NotFoundError';
import apiErrorFactory from '../../../../modules/errors/factories/apiErrorFactory';
import userPublisher from '../../../../modules/publishers/user';
import facade from '../../../../modules/users/facade';
import basicAuth from '../../../../modules/authentication/basic';
import accessTokenRepository from '../../../../modules/users/accessTokenRepository';

const router = express.Router({
  mergeParams: true,
});

router.post('/', (request, response) => {
  facade.signUp({
    email: request.body.email,
    password: request.body.password,
  })
    .then((user) => userPublisher.publish(user, { accessToken: true }))
    .then((publishedUser) => response.status(HttpStatuses.CREATED).json(publishedUser))
    .catch((error) => {
      let apiError;

      if (error instanceof db.Sequelize.Error) {
        throw apiErrorFactory.createFromSequelizeError(error);
      } else if (error instanceof BaseError) {
        apiError = apiErrorFactory.createFromBaseError(error);
      } else {
        apiError = apiErrorFactory.createFromMessage(error);
      }

      response.status(apiError.statusCode)
        .json(apiError.json);
    });
});

router.use('/:id', userRouter);

export default router;
