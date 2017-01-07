<template>
  <profile-page
    :username="username"
    :url="url"
    :links="links"
  ></profile-page>
</template>

<script>
  import config from '../../../../../config/client';
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

      url() {
        return this.$store.state.profile.url;
      },

      links() {
        return this.$store.state.profile.links;
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

      const links = await apiClient.getProfileLinksByProfileId(profile.id);

      store.commit(PROFILE_SET, {
        username: profile.username,
        url: `${config.baseUrl}/${profile.username}`,
        links,
      });
    },

    htmlHead: {
      links: [
        {
          rel: 'authorization_endpoint',
          href: 'https://indieauth.com/auth',
        },
        {
          rel: 'token_endpoint',
          href: 'https://tokens.indieauth.com/token',
        },
        {
          rel: 'micropub',
          href: `${config.baseUrl}/micropub`,
        },
      ],
    },
  };
</script>
