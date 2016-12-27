/**
 * @external Request
 * @see http://expressjs.com/en/api.html#req
 */

/**
 * @external Response
 * @see http://expressjs.com/en/api.html#res
 */

import express from 'express';

import users from './users';

const router = express.Router({
  mergeParams: true,
});

router.get('/', (request, response) => {
  response.json({});
});

router.use('/users', users);

export default router;
