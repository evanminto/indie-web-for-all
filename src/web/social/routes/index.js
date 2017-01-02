import express from 'express';

import { fallback, getProfile } from './actions';

const router = express.Router({
  mergeParams: true,
});

router.get('/:username', getProfile);
router.get('/*', fallback);

export default router;
