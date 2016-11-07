import Vue from 'vue';

import router from './router';

const app = new Vue({
  render: function render(createElement) {
    return createElement('router-view');
  },
  router: router,
});

export default {
  app,
  router,
};
