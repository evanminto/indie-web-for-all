<template>
  <section>
    <h1>Profile</h1>

    <profile-form></profile-form>
  </section>
</template>

<script>
  import ProfileFormComponent from './ProfileForm.vue';

  export default {
    components: {
      'profile-form': ProfileFormComponent,
    },
  };
</script>