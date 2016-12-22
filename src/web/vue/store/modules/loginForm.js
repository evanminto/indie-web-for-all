import { GET_LOGIN_EMAIL, GET_LOGIN_PASSWORD } from '../mutationTypes';

export default {
  state: {
    email: '',
    password: '',
  },

  mutations: {
    [GET_LOGIN_EMAIL](state, email) {
      state.email = email;
    },

    [GET_LOGIN_PASSWORD](state, password) {
      state.password = password;
    },
  },
};
