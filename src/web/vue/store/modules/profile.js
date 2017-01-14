import { PROFILE_SET } from '../mutationTypes';

/**
 * The profile being shown to the user.
 * This is different from currentUserProfile, which is the profile
 * of the currently logged-in user.
 */
export default {
  state: {
    username: '',
    url: '',
    links: [],
    notes: [],
  },

  mutations: {
    [PROFILE_SET](state, { username, url, links, notes }) {
      state.username = username;
      state.url = url;
      state.links = links;
      state.notes = notes;
    },
  },
};
