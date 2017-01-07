import express from 'express';

import micropubRouter from './micropub';
import profileRouter from './profile';
import { fallback } from './actions';

const router = express.Router({
  mergeParams: true,
});

router.use('/micropub', micropubRouter);
router.use('/:username', profileRouter);
router.get('/*', fallback);

export default router;
