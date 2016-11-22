import domReady from 'document-ready-promise';

import { app, router } from './web/vue';

router.replace(location.pathname);

domReady().then(() => app.$mount('#app'));
