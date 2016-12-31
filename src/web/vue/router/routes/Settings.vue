<template>
  <app-base>
    <section>
      <h1>Settings</h1>
      <profile-section></profile-section>
    </section>
  </app-base>
</template>

<script>
  import store from '../../store';
  import AppBaseComponent from '../../components/AppBase.vue';
  import ProfileSectionComponent from '../../components/ProfileSection.vue';

  export default {
    components: {
      'app-base': AppBaseComponent,
      'profile-section': ProfileSectionComponent,
    },
  };
</script>
