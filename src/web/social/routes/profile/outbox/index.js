import express from 'express';

import AcceptHeader from '../../../middleware/AcceptHeaderRequirements';
import { getOutbox } from './actions';

const router = express.Router({
  mergeParams: true,
});

router.get('/', AcceptHeader.activityStreams, getOutbox);

export default router;
