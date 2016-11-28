import express from 'express';

import { getUser } from './actions';
import profileRouter from './profile';

const router = express.Router({
  mergeParams: true,
});

router.get('/', getUser);
router.use('/profile', profileRouter);

export default router;
