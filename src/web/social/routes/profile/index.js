import express from 'express';

import outbox from './outbox';
import { getProfile } from './actions';

const router = express.Router({
  mergeParams: true,
});

router.get('/', getProfile);
router.use('/outbox', outbox);

export default router;
