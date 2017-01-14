import express from 'express';

import micropubRouter from './micropub';
import outboxRouter from './outbox';
import { getProfile } from './actions';

const router = express.Router({
  mergeParams: true,
});

router.get('/', getProfile);
router.use('/outbox', outboxRouter);
router.use('/micropub', micropubRouter);

export default router;
