import express from 'express';

import profileRouter from './profile';
import { getProfiles } from './actions';

const router = express.Router({
  mergeParams: true,
});

router.get('/', getProfiles);
router.use('/:profileId', profileRouter);

export default router;
