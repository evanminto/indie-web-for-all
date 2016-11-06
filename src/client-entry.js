const domReady = require('document-ready-promise');

const vm = require('./vue/app.js');

domReady().then(() => vm.$mount('#app'));
