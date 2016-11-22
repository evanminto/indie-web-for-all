<template>
  <form @submit="signUp">
    <output>{{formError}}</output>

    <p>
      <label>
        <span class="label-text">Email</span>
        <input id="email_field" type="email" name="email" required v-model="email">
        <output for="email_field">{{emailError}}</output>
      </label>
    </p>

    <p>
      <label>
        <span class="label-text">Password</span>
        <input id="password_field" type="password" name="password" required v-model="password">
        <output for="password_field">{{passwordError}}</output>
      </label>
    </p>

    <button type="submit" v-bind:disabled="!valid">Sign Up</button>
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
        formError: '',
        emailError: '',
        passwordError: '',
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

      signUp(event) {
        event.preventDefault();

        userRegistrar.register(this.$data.email, this.$data.password)
          .then((data) => currentSession.logIn(this.$data.email, this.$data.password))
          .then(() => this.$router.push(SETTINGS))
          .catch((data) => {
            console.error(data);

            if (data.errors) {
              data.errors.forEach((error) => {
                if (error.field === 'email') {
                  this.$data.emailError = error.message;
                }

                if (error.field === 'password') {
                  this.$data.passwordError = error.message;
                }
              });
            }
          });
      },
    },
  };
</script>
