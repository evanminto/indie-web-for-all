import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import router from './router';
import store from './store';

sync(store, router);

const app = new Vue({
  router,
  store,
  name: 'App',

  render(createElement) {
    return createElement('router-view');
  },
});

export default app;
export {
  app,
  router,
  store,
};
