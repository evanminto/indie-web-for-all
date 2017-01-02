<template>
  <profile-page
    :username="username"
    :path="path"
  ></profile-page>
</template>

<script>
  import apiClient from '../../../modules/api/v0/client';
  import ProfilePageComponent from '../../components/ProfilePage.vue';
  import { PROFILE_SET } from '../../store/mutationTypes';

  export default {
    components: {
      'profile-page': ProfilePageComponent,
    },

    computed: {
      username() {
        return this.$store.state.profile.username;
      },

      path() {
        return this.$store.state.profile.path;
      },
    },

    mounted() {
      this.$options.preFetch(this.$store);
    },

    /**
     * @param  {external:Store} store
     * @return {Promise}
     */
    async preFetch(store) {
      const profile = await apiClient.getProfileByUsername(store.state.route.params.username);

      if (!profile) {
        throw { message: 'Route not found.' };
      }

      store.commit(PROFILE_SET, {
        username: profile.username,
        path: `/${profile.username}`,
      });
    },
  };
</script>
