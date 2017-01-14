import express from 'express';

import config from '../../../../config/client';
import profileRouter from './profile';
import { fallback } from './actions';

const router = express.Router({
  mergeParams: true,
});

router.use('/:username', profileRouter);

if (process.env.NODE_ENV !== 'production') {
  router.route('/token_dev')
    .get(tokenDev)
    .post(tokenDev);
}

router.get('/*', fallback);

/**
 * Always accept access tokens on dev/test.
 *
 * @param  {external:Request} request
 * @param  {external:Response} response
 */
function tokenDev(request, response) {
  response.send(`me=${config.baseUrl}&scope=post`);
}

export default router;
