import domReady from 'document-ready-promise';

import vueApp from '../vue/app';

vueApp.router.replace(location.pathname);

domReady().then(() => vueApp.app.$mount('#app'));
