import { PROFILE_SET } from '../mutationTypes';

/**
 * The profile being shown to the user.
 * This is different from currentUserProfile, which is the profile
 * of the currently logged-in user.
 */
export default {
  state: {
    username: '',
    path: '',
    links: [],
  },

  mutations: {
    [PROFILE_SET](state, { username, path, links }) {
      state.username = username;
      state.path = path;
      state.links = links;
    },
  },
};
