<template>
  <div>
    <header>
      <h1>Indie Web for All</h1>
      <button type="button" v-if="loggedIn" @click="logOut">Log Out</button>
    </header>

    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script>
  import { LOGIN } from '../router/routes';
  import userAuthentication from '../../modules/userAuthentication';

  export default {
    computed: {
      loggedIn() {
        return userAuthentication.isLoggedIn;
      },
    },

    methods: {
      logOut() {
        userAuthentication.logOut();
        this.$router.push(LOGIN);
      },
    },
  };
</script>