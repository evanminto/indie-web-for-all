<template>
  <app-base>
    <section>
      <h1>Log In</h1>
      <login-form></login-form>
      <router-link to="/signup">or sign up</router-link>
    </section>
  </app-base>
</template>

<script>
  import AppBaseComponent from '../../components/AppBase.vue';
  import LoginFormComponent from '../../components/LoginForm.vue';

  export default {
    components: {
      'app-base': AppBaseComponent,
      'login-form': LoginFormComponent,
    }
  };
</script>
