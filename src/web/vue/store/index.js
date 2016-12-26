import Vue from 'vue';
import Vuex from 'vuex';

import currentSession from './modules/currentSession';
import currentUserProfile from './modules/currentUserProfile';
import loginForm from './modules/loginForm';
import signupForm from './modules/signupForm';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    currentSession,
    currentUserProfile,
    loginForm,
    signupForm,
  },
});
