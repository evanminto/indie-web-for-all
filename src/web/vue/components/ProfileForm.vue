<template>
  <form @submit="updateProfile">
    <p>
      <label>
        <span class="label-text">Username</span>
        <input id="username_field" name="username" v-model="username">
        <output for="username_field">{{usernameError}}</output>
      </label>
    </p>

    <button type="submit">Update</button>
  </form>
</template>

<script>
  import requestFactory from '../../modules/api/v0/requestFactory';

  export default {
    data() {
      return {
        username: '',
        usernameError: '',
      };
    },

    mounted() {
      const request = requestFactory.getProfile();

      fetch(request)
        .then((response) => {
          if (response.ok) {
            return response.json()
              .then((data) => {
                this.$data.username = data.username;
              });
          }

          return response.json()
            .then((data) => {
              console.error(data);
            })
        })
        .catch((error) => {
          console.error(error);
        })
    },

    methods: {
      updateProfile(event) {
        event.preventDefault();

        const request = requestFactory.updateProfile({
          username: this.$data.username,
        });

        fetch(request)
          .then((response) => response.json())
          .then((data) => {
            if (data.errors) {
              data.errors.forEach((error) => {
                if (error.field === 'username') {
                  this.$data.usernameError = error.message;
                }
              });
            }
          });
      },
    },
  };
</script>
