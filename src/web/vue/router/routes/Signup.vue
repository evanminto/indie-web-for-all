<template>
  <section>
    <h1>Sign Up</h1>
    <signup-form></signup-form>
    <router-link to="/login">or log in</router-link>
  </section>
</template>

<script>
  import SignupFormComponent from '../../components/SignupForm.vue';

  export default {
    components: {
      'signup-form': SignupFormComponent,
    }
  };
</script>
