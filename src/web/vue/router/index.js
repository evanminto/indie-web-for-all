import Vue from 'vue';
import VueRouter from 'vue-router';

import apiClient from '../../modules/api/v0/client';
import config from '../../../../config/client';
import LoginRoute from './routes/Login.vue';
import ProfileRoute from './routes/Profile.vue';
import SettingsRoute from './routes/Settings.vue';
import SignupRoute from './routes/Signup.vue';
import userAuthentication from '../../modules/userAuthentication';
import { PROFILE_SET } from '../store/mutationTypes';

import {
  INDEX,
  LOGIN,
  LOGOUT,
  PROFILE,
  SETTINGS,
  SIGNUP,
} from './routes';

Vue.use(VueRouter);

const authenticatedRoutes = [
  SETTINGS,
];

const unauthenticatedRoutes = [
  LOGIN,
  SIGNUP,
];

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: INDEX, redirect: LOGIN },
    { path: LOGIN, component: LoginRoute },
    { path: SETTINGS, component: SettingsRoute },
    { path: SIGNUP, component: SignupRoute },
    { path: PROFILE, component: ProfileRoute },
  ],
});

let attemptedSessionContinue = false;

router.beforeEach(async (to, from, next) => {
  // Only continue once per app instance.
  if (
    (authenticatedRoutes.concat(unauthenticatedRoutes)).includes(to.path) &&
    !userAuthentication.isLoggedIn &&
    !attemptedSessionContinue
  ) {
    await userAuthentication.continueSession();

    attemptedSessionContinue = true;
  }

  if (authenticatedRoutes.includes(to.path)) {
    if (userAuthentication.isLoggedIn) {
      next();
    } else {
      next(LOGIN);
    }
  } else if (unauthenticatedRoutes.includes(to.path)) {
    if (userAuthentication.isLoggedIn) {
      next(SETTINGS);
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
