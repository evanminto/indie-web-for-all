import express from 'express';

import { createNote, getNotes } from './actions';

const router = express.Router({
  mergeParams: true,
});

router.route('/')
  .get(getNotes)
  .post(createNote);

export default router;
