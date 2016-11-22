<template>
  <section>
    <h1>Settings</h1>
    <profile-section></profile-section>
  </section>
</template>

<script>
  import store from '../../store';
  import ProfileSectionComponent from '../../components/ProfileSection.vue';

  export default {
    components: {
      'profile-section': ProfileSectionComponent,
    },
  };
</script>
