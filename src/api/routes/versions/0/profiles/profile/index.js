import express from 'express';

import linksRouter from './links';

const router = express.Router({
  mergeParams: true,
});

router.use('/links', linksRouter);

export default router;
