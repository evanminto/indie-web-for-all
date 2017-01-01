import express from 'express';

import { getProfiles } from './actions';

const router = express.Router({
  mergeParams: true,
});

router.get('/', getProfiles);

export default router;
