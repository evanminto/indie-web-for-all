import express from 'express';

import { createContent } from './actions';

const router = express.Router({
  mergeParams: true,
});

router.post('/', createContent);

export default router;
