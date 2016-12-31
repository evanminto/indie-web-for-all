import 'babel-polyfill';
import domReady from 'document-ready-promise';

import { app, router } from './web/vue';

router.replace(location.pathname);

(async () => {
  await domReady();
  app.$mount('#app');
})();
