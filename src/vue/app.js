const Vue = require('vue');
const LoginFormComponent = require('./LoginForm.vue');

module.exports = new Vue({
  render: function render(createElement) {
    return createElement(
      'div',
      {
        attrs: {id: 'app'},
      },
      [
        createElement('login-form'),
      ]
    )
  },
  components: {
    'login-form': LoginFormComponent,
  },
});
