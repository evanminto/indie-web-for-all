import passport from 'passport';
import { BasicStrategy } from 'passport-http';

import accountRepository from '../users/accountRepository';
import errorPublisher from '../publishers/error';

import NotFoundError from '../errors/NotFoundError';
import ValidationError from '../errors/ValidationError';

passport.use(new BasicStrategy(
  function(email, password, callback) {
    accountRepository.getByEmail(email)
      .then((account) => account.getCredentials())
      .then((credentials) => {
        if (!credentials.passwordMatches(password)) {
          callback(null, false, {
            message: 'Password does not match.'
          });

          return;
        }

        credentials.getAccount()
          .then((account) => account.getUser())
          .then((user) => callback(null, user));
      })
      .catch((error) => {
        if (error instanceof NotFoundError) {
          callback(null, false, error);

          return;
        }

        callback(error);
      });
  }
));

export default function authenticateWithBasicAuth(request, response, next) {
  return new Promise((resolve, reject) => {
    passport.authenticate('basic', (err, user, info) => {
      if (err) {
        reject(err);
      } else if (user) {
        resolve(user);
      } else {
        reject(info);
      }
    })(request, response, next);
  });
};
