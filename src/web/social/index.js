/**
 * Routes to the APIs for social web integration (ActivityPub, MicroPub, etc.)
 * These routes are separated since they have vastly different authentication
 * requirements from the main first-party API and are intended for different users.
 */
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';

import AcceptHeader from './middleware/AcceptHeaderRequirements';
import { createViaMicropub } from './controllers/micropub';
import { getActivity } from './controllers/activity';
import { getNote } from './controllers/note';
import { getOutbox } from './controllers/outbox';
import { getProfile } from './controllers/profile';
import { fallback } from './controllers/fallback';
import { tokenDev } from './controllers/indieAuth';

const router = express.Router({
  mergeParams: true,
});

const multipart = multer();

router.use(multipart.single());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/:username', getProfile);
router.use('/:username/micropub', createViaMicropub);
router.get('/:username/outbox', AcceptHeader.activityStreams, getOutbox);
router.get('/:username/activities/:activityId', AcceptHeader.activityStreams, getActivity);
router.get('/:username/notes/:noteId', AcceptHeader.activityStreams, getNote);

if (process.env.NODE_ENV !== 'production') {
  router.route('/token_dev')
    .get(tokenDev)
    .post(tokenDev);
}

router.get('/*', fallback);

export default router;
