import express from 'express';

import { getLinks, addLink, updateLink } from './actions';

const router = express.Router({
  mergeParams: true,
});

router.route('/')
  .get(getLinks)
  .post(addLink);

export default router;
