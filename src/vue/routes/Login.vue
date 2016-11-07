<template>
  <section>
    <h1>Log In</h1>
    <login-form></login-form>
    <router-link to="/signup">or sign up</router-link>
  </section>
</template>

<script>
  import LoginFormComponent from '../components/LoginForm.vue';

  export default {
    components: {
      'login-form': LoginFormComponent,
    }
  };
</script>
