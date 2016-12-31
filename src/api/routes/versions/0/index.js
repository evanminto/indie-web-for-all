import express from 'express';

import users from './users';
import userAccessTokens from './userAccessTokens';

const router = express.Router({
  mergeParams: true,
});

router.get('/', (request, response) => {
  response.json({});
});

router.use('/users', users);
router.use('/user_access_tokens', userAccessTokens);

export default router;
