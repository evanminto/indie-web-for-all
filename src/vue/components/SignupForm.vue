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
  import requestFactory from '../../apiRequestFactory';

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
        this.createUser();
      },

      createUser() {
        const request = requestFactory.createCreateUserRequest(new FormData(this.$el));

        fetch(request)
          .then((response) => {
            const responsePromise = Promise.resolve(response);

            if (response.ok) {
              responsePromise
                .then((response) => response.json())
                .then((data) => this.$router.push('/login'));
            }

            return responsePromise
              .then((response) => response.json())
              .then((data) => {
                data.errors.forEach((error) => {
                  if (error.field === 'email') {
                    this.$data.emailError = error.message;
                  }

                  if (error.field === 'password') {
                    this.$data.passwordError = error.message;
                  }
                });
              });
          });
      },
    },
  };
</script>