import { USER_IS_LOGGED_IN } from '../getterTypes';
import { SET_CURRENT_USER_CREDS } from '../mutationTypes';

export default {
  state: {
    userId: '',
    userAccessToken: '',
  },

  getters: {
    [USER_IS_LOGGED_IN](state) {
      return Boolean(state.userId && state.userAccessToken);
    },
  },

  mutations: {
    [SET_CURRENT_USER_CREDS](state, { id, accessToken }) {
      state.userId = id;
      state.userAccessToken = accessToken;
    },
  },
};
