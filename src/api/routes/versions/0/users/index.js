import express from 'express';
import HttpStatuses from 'http-status-codes';

import db from '../../../../db';
import userRouter from './user';
import ApiError from '../../../../modules/errors/ApiError';
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
      if (error instanceof db.Sequelize.Error) {
        throw apiErrorFactory.createFromSequelizeError(error);
      } else {
        throw new ApiError(HttpStatuses.INTERNAL_SERVER_ERROR, error.message);
      }
    })
    .catch((error) => {
      response.status(error.statusCode)
        .json(error.json);
    });
});

router.get('/access_tokens', (request, response) => {
  let selectedToken;
  let selectedUser;

  return new Promise((resolve, reject) => {
    if (request.query.token && request.query.user_id) {
      accessTokenRepository.getByValue(request.query.token)
        .then((token) => {
          selectedToken = token;

          return token.getUser();
        })
        .then((user) => {
          selectedUser = user;

          // Weak equality to account for type mismatch between DB and API.
          if (user.id != request.query.user_id) {
            throw new NotFoundError('Wrong user ID.');
          }

          resolve();
        })
        .catch((error) => {
          if (error instanceof NotFoundError) {
            reject(new ApiError(HttpStatuses.NOT_FOUND, 'Token not found.'));
          }

          reject(new ApiError(HttpStatuses.INTERNAL_SERVER_ERROR, error.message));
        });
    } else {
      basicAuth(request, response)
        .then((user) => {
          selectedUser = user;

          return user.getAccessToken();
        })
        .then((token) => {
          selectedToken = token;

          resolve();
        })
        .catch((error) => {
          reject(new ApiError(HttpStatuses.UNAUTHORIZED, 'Authentication is required to access this resource.'));
        });
    }
  })
    .then(() => {
      response.json({
        token: selectedToken.value,
        userId: selectedUser.id,
      });
    })
    .catch((error) => {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(HttpStatuses.INTERNAL_SERVER_ERROR, error.message);
    })
    .catch((error) => {
      response.status(error.statusCode)
        .json(error.json);
    });
});

router.use('/:id', userRouter);

export default router;
