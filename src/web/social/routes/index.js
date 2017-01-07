import express from 'express';

import profile from './profile';
import { fallback } from './actions';

const router = express.Router({
  mergeParams: true,
});

router.use('/:username', profile);
router.get('/*', fallback);

export default router;
