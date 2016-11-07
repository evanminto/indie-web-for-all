const Vue = require('vue');

const LoginFormComponent = require('./components/LoginForm.vue');
const SignupFormComponent = require('./components/SignupForm.vue');

module.exports = new Vue({
  render: function render(createElement) {
    return createElement(
      'div',
      {
        attrs: {id: 'app'},
      },
      [
        createElement('login-form'),
        createElement('signup-form'),
      ]
    )
  },
  components: {
    'login-form': LoginFormComponent,
    'signup-form': SignupFormComponent,
  },
});
