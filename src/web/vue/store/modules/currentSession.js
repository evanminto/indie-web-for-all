import { SESSION_SET_CREDS, SESSION_CLEAR } from '../mutationTypes';

export default {
  state: {
    userId: '',
    userAccessToken: '',
  },

  getters: {
    sessionHasCredentials(state) {
      return Boolean(state.userId && state.userAccessToken);
    },
  },

  mutations: {
    [SESSION_SET_CREDS](state, { accessToken, userId }) {
      state.userId = userId;
      state.userAccessToken = accessToken;
    },

    [SESSION_CLEAR](state) {
      state.userId = undefined;
      state.userAccessToken = undefined;
    },
  },
};
