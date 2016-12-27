import { LOGIN_SET_EMAIL, LOGIN_SET_PASSWORD } from '../mutationTypes';

export default {
  state: {
    email: '',
    password: '',
  },

  mutations: {
    [LOGIN_SET_EMAIL](state, email) {
      state.email = email;
    },

    [LOGIN_SET_PASSWORD](state, password) {
      state.password = password;
    },
  },
};
