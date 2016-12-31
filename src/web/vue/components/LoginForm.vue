<template>
  <form @submit="logIn">
    <input type="email" name="email" required @input="updateEmail">
    <input type="password" name="password" required @input="updatePassword">
    <button type="submit" v-bind:disabled="!valid">Log In</button>
  </form>
</template>

<script>
  import store from '../store';
  import { LOGIN_SET_EMAIL, LOGIN_SET_PASSWORD } from '../store/mutationTypes';
  import userAuthentication from '../../modules/userAuthentication';
  import userRegistrar from '../../modules/userRegistrar';
  import { SETTINGS } from '../router/routes';

  export default {
    data() {
      return {
        valid: false,
      };
    },

    computed: {
      email() {
        return store.state.loginForm.email;
      },

      password() {
        return store.state.loginForm.password;
      },
    },

    mounted() {
      this.$data.valid = this.$el.checkValidity();
    },

    methods: {
      updateEmail(event) {
        store.commit(LOGIN_SET_EMAIL, event.target.value);
        this.$data.valid = this.$el.checkValidity();
      },

      updatePassword(event) {
        store.commit(LOGIN_SET_PASSWORD, event.target.value);
        this.$data.valid = this.$el.checkValidity();
      },

      async logIn(event) {
        event.preventDefault();

        try {
          const success = await userAuthentication.logIn(
            store.state.loginForm.email,
            store.state.loginForm.password
          );

          if (success) {
            this.$router.push(SETTINGS);
          } else {
            // TODO: Show error message.
          }
        } catch (error) {
          // TODO: Show error message.
          console.error('Failed to log in:', data);
        }
      }
    },
  };
</script>
