import express from 'express';

import Actions from './actions';

const router = express.Router({
  mergeParams: true,
});

router.get('/', Actions.getUser);

router.route('/profile')
  .get(Actions.getProfile)
  .post(Actions.updateProfile)
  .patch(Actions.updateProfile)
  .put(Actions.updateProfile);

export default router;
