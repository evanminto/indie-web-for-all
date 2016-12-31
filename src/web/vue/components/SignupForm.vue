<template>
  <form @submit="signUp">
    <output>{{formError}}</output>

    <p>
      <label>
        <span class="label-text">Email</span>
        <input id="email_field" type="email" name="email" required @input="updateEmail">
        <output for="email_field">{{emailError}}</output>
      </label>
    </p>

    <p>
      <label>
        <span class="label-text">Password</span>
        <input id="password_field" type="password" name="password" required @input="updatePassword">
        <output for="password_field">{{passwordError}}</output>
      </label>
    </p>

    <button type="submit" v-bind:disabled="!valid">Sign Up</button>
  </form>
</template>

<script>
  import { SIGNUP_SET_EMAIL, SIGNUP_SET_PASSWORD } from '../store/mutationTypes';
  import { SETTINGS } from '../router/routes';
  import store from '../store';
  import userAuthentication from '../../modules/userAuthentication';
  import userRegistrar from '../../modules/userRegistrar';

  export default {
    data() {
      return {
        valid: false,
        formError: '',
        emailError: '',
        passwordError: '',
      };
    },

    computed: {
      email() {
        return store.state.signupForm.email;
      },

      password() {
        return store.state.signupForm.password;
      },
    },

    mounted() {
      this.$data.valid = this.$el.checkValidity();
    },

    methods: {
      updateEmail(event) {
        store.commit(SIGNUP_SET_EMAIL, event.target.value);
        this.$data.valid = this.$el.checkValidity();
      },

      updatePassword(event) {
        store.commit(SIGNUP_SET_PASSWORD, event.target.value);
        this.$data.valid = this.$el.checkValidity();
      },

      async signUp(event) {
        event.preventDefault();

        try {
          const data = await userRegistrar.register(
            store.state.signupForm.email,
            store.state.signupForm.password
          );

          const loginSuccess = await userAuthentication.logIn(
            store.state.signupForm.email,
            store.state.signupForm.password
          );

          if (loginSuccess) {
            this.$router.push(SETTINGS);
          } else {
            // TODO: Show error message.
          }
        } catch (error) {
          throw error;

          if (error.errors) {
            error.errors.forEach((error) => {
              if (error.field === 'email') {
                this.$data.emailError = error.message;
              }

              if (error.field === 'password') {
                this.$data.passwordError = error.message;
              }
            });
          }
        }
      },
    },
  };
</script>
