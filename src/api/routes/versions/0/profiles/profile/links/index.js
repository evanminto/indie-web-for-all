import express from 'express';

import { getLinks } from './actions';

const router = express.Router({
  mergeParams: true,
});

router.get('/', getLinks);

export default router;
