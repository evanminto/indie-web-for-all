import { ADD_USER_PROFILE_LINK, CHANGE_USERNAME, SET_USER_PROFILE_LINKS } from '../mutationTypes';

export default {
  state: {
    username: '',
    links: [],
  },

  mutations: {
    [ADD_USER_PROFILE_LINK](state, { url, name }) {
      if (linkUrlAlreadyExists(state, url)) {
        return;
      }

      state.links.push({
        name,
        url,
        rel: 'me',
      });
    },

    [SET_USER_PROFILE_LINKS](state, links) {
      state.links = links;
    },

    [CHANGE_USERNAME](state, username) {
      state.username = username;
    },
  },
};

/**
 * @param  {Object} state
 * @param  {String} url
 * @return {Boolean}
 * @private
 */
function linkUrlAlreadyExists(state, url) {
  const linkCount = state.links.length;

  for (let i = 0; i < linkCount; i++) {
    if (state.links[i].url === url) {
      return true;
    }
  }

  return false;
}
