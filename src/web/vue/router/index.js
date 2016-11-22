import Vue from 'vue';
import VueRouter from 'vue-router';

import LoginRoute from './routes/Login.vue';
import SettingsRoute from './routes/Settings.vue';
import SignupRoute from './routes/Signup.vue';
import currentSession from '../../modules/currentSession';

import {
  INDEX,
  LOGIN,
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
  ],
});

router.beforeEach((to, from, next) => {
  if (authenticatedRoutes.indexOf(to.path) > -1) {
    currentSession.checkUserLoggedIn()
      .then((loggedIn) => {
        if (loggedIn) {
          next();
        } else {
          next(LOGIN);
        }
      })
      .catch(() => next(LOGIN));
  } else if (unauthenticatedRoutes.indexOf(to.path) > -1) {
    currentSession.checkUserLoggedIn()
      .then((loggedIn) => {
        if (loggedIn) {
          next(SETTINGS);
        } else {
          next();
        }
      })
      .catch(() => next(SETTINGS));
  } else {
    next();
  }
});

export default router;
