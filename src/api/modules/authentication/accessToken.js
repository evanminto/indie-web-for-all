/**
 * @external Request
 * @see http://expressjs.com/en/api.html#req
 */

/**
 * @external Response
 * @see http://expressjs.com/en/api.html#res
 */

import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';

import accessTokenRepository from '../users/accessTokenRepository';
import errorPublisher from '../publishers/error';

import NotFoundError from '../errors/NotFoundError';

passport.use(new BearerStrategy(
  function(bearerValue, callback) {
    accessTokenRepository.getByValue(bearerValue)
      .then((token) => token.getUser())
      .then((user) => callback(null, user))
      .catch((error) => {
        if (error instanceof NotFoundError) {
          callback(null, false, errorPublisher.publishBaseError(error));

          return;
        }

        callback(null, false, error);
      });
  }
));

/**
 * Checks that Bearer token is set to a valid access token.
 *
 * @param  {external:Request}    request
 * @param  {external:Response}   response
 * @param  {Function}            next
 * @return {Promise.<User, String>}
 */
export default function authenticateWithBearerAuth(request, response, next) {
  return new Promise((resolve, reject) => {
    passport.authenticate('bearer', (err, user, info) => {
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
