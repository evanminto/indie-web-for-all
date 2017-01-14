import express from 'express';

import linksRouter from './links';
import notesRouter from './notes';

const router = express.Router({
  mergeParams: true,
});

router.use('/links', linksRouter);
router.use('/notes', notesRouter);

export default router;
