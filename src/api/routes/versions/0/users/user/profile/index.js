import express from 'express';

import { getProfile, updateProfile } from './actions';
import linksRouter from './links';

const router = express.Router({
  mergeParams: true,
});

router.route('/')
  .get(getProfile)
  .patch(updateProfile)
  .put(updateProfile);

router.use('/links', linksRouter);

export default router;
