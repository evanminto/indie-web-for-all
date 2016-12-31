<template>
  <app-base>
    <section>
      <h1>Sign Up</h1>
      <signup-form></signup-form>
      <router-link to="/login">or log in</router-link>
    </section>
  </app-base>
</template>

<script>
  import AppBaseComponent from '../../components/AppBase.vue';
  import SignupFormComponent from '../../components/SignupForm.vue';

  export default {
    components: {
      'app-base': AppBaseComponent,
      'signup-form': SignupFormComponent,
    }
  };
</script>
