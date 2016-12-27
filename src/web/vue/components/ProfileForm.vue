<template>
  <form @submit="updateProfile">
    <p>
      <label>
        <span class="label-text">Username</span>

        <input
          id="username_field"
          name="username"
          :value="username"
          @input="updateUsername"
        >

        <output for="username_field">{{usernameError}}</output>
      </label>
    </p>

    <fieldset>
      <legend>Links</legend>

      <ul>
        <li v-for="(link, index) in links">
          <fieldset name="links[]" @input="updateLink">
            <label>
              <span class="label-text">URL</span>
              <input
                :id="`link_${index}_url_field`"
                :disabled="link.id"
                name="url"
                type="url"
                :value="link.url"
                :data-id="link.id"
                :data-index="index"
              >
            </label>

            <label>
              <span class="label-text">Name</span>
              <input
                :id="`link_${index}_name_field`"
                :disabled="link.id"
                name="name"
                :value="link.name"
                :data-id="link.id"
                :data-index="index"
              >
            </label>
          </fieldset>
        </li>
      </ul>
    </fieldset>

    <button type="submit">Update</button>
  </form>
</template>

<script>
  import requestFactory from '../../modules/api/v0/requestFactory';
  import currentUserProfile from '../../modules/currentUserProfile';

  const placeholderLink = {
    url: '',
    name: '',
  };

  export default {
    data() {
      return {
        usernameError: '',
      };
    },

    computed: {
      username: () => currentUserProfile.getUsername(),

      links() {
        return currentUserProfile.getLinks().concat([{
          rel: 'me',
        }]);
      },
    },

    async mounted() {
      await currentUserProfile.initialize();
    },

    methods: {
      updateLink(event) {
        const input = event.target;
        const index = parseInt(input.dataset.index, 10);
        const links = currentUserProfile.getLinks();

        if (!links[index]) {
          links.push({});
        }

        switch (input.name) {
          case 'name':
            links[index].name = input.value;
            break;
          case 'url':
            links[index].url = input.value;
            break;
        }

        currentUserProfile.setLinks(links);
      },

      updateUsername(event) {
        currentUserProfile.setUsername(event.target.value);
      },

      async updateProfile(event) {
        event.preventDefault();

        await currentUserProfile.save();
        await currentUserProfile.initialize();
      },
    },
  };
</script>
