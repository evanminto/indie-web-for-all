<template>
  <form @submit="logIn">
    <input type="email" name="email" required v-model="email">
    <input type="password" name="password" required v-model="password">
    <button type="submit" v-bind:disabled="!valid">Log In</button>
  </form>
</template>

<script>
  import currentSession from '../../modules/currentSession';
  import userRegistrar from '../../modules/userRegistrar';
  import { SETTINGS } from '../router/routes';

  export default {
    data() {
      return {
        email: '',
        password: '',
        valid: false,
      };
    },

    mounted() {
      this.checkValidity();
    },

    updated() {
      this.checkValidity();
    },

    methods: {
      checkValidity() {
        this.valid = this.$el.checkValidity();
      },

      logIn(event) {
        event.preventDefault();

        currentSession.logIn(this.$data.email, this.$data.password)
          .then(() => this.$router.push(SETTINGS))
          .catch((data) => console.error('Failed to get log in:', data.message));
      }
    },
  };
</script>