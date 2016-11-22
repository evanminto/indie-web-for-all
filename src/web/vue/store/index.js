import Vue from 'vue';
import Vuex from 'vuex';

import currentSession from './modules/currentSession';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    currentSession,
  },
});
