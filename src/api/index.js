/**
 * Routes for all APIs.
 */
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';

import {
  addLink,
  getLinks,
  getLinksByUserId,
} from './controllers/core/v0/link';
import { createToken, getToken } from './controllers/core/v0/userAccessToken';
import { createUser, getUser } from './controllers/core/v0/user';
import { createViaMicropub } from './controllers/social/micropub';
import { fallback } from './controllers/social/fallback';
import { getActivity } from './controllers/social/activity';
import { getNote } from './controllers/social/note';
import { getOutbox } from './controllers/social/outbox';
import { getProfile } from './controllers/social/profile';
import {
  getProfileByUserId,
  getProfiles,
  updateProfileByUserId,
} from './controllers/core/v0/profile';
import { tokenDev } from './controllers/social/indieAuth';

const router = express.Router({
  mergeParams: true,
});

const multipart = multer();

router.use(multipart.single());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/api/v0', (request, response) => {
  response.json({});
});

router.post('/api/v0/users', createUser);
router.get('/api/v0/users/:id', getUser);
router.post('/api/v0/user_access_tokens', createToken);
router.get('/api/v0/user_access_tokens/:token', getToken);

router.get('/api/v0/profiles', getProfiles);

router.route('/api/v0/profiles/:profileId/links')
  .get(getLinks)
  .post(addLink);

router.route('/api/v0/users/:id/profile')
  .get(getProfileByUserId)
  .patch(updateProfileByUserId)
  .put(updateProfileByUserId);

router.route('/api/v0/users/:id/profile/links')
  .get(getLinksByUserId)
  .post(addLink);

// Return 404 response when the API doesn't recognize a route.
router.all('/api/*', (request, response) => {
  response.status(404);
  response.json({
    message: 'Route not found.',
  });
});

router.get('/:username', getProfile);
router.use('/:username/micropub', createViaMicropub);
router.get('/:username/outbox', getOutbox);
router.get('/:username/activities/:activityId', getActivity);
router.get('/:username/notes/:noteId', getNote);

if (process.env.NODE_ENV !== 'production') {
  router.route('/token_dev')
    .get(tokenDev)
    .post(tokenDev);
}

router.get('/*', fallback);

export default router;
