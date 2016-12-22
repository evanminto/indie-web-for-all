<template>
  <form @submit="updateProfile">
    <p>
      <label>
        <span class="label-text">Username</span>
        <input id="username_field" name="username" :value="username">
        <output for="username_field">{{usernameError}}</output>
      </label>
    </p>

    <fieldset>
      <legend>Links</legend>

      <ul>
        <li v-for="(link, index) in links">
          <label>
            <span class="label-text">URL</span>
            <input :id="`link_${index}_url_field`" :name="`links[${index}][url]`" v-model="link.url">
          </label>

          <label>
            <span class="label-text">Name</span>
            <input :id="`link_${index}_name_field`" :name="`links[${index}][name]`" v-model="link.name">
          </label>
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
      return {};
    },

    computed: {
      username() {
        return currentUserProfile.getUsername();
      },

      links() {
        return currentUserProfile.getLinks();
      }
    },

    mounted() {

    },

    methods: {
      updateProfile(event) {
        event.preventDefault();

        (async () => {
          const username = null;
          const links = null;

          await currentUserProfile.setUsername(username);
          await currentUserProfile.setLinks(links);
        })();
      },
    },
  };

  function getFormDataObject(formEl) {

  }
</script>
