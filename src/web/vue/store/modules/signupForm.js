import { SIGNUP_SET_EMAIL, SIGNUP_SET_PASSWORD } from '../mutationTypes';

export default {
  state: {
    email: '',
    password: '',
  },

  mutations: {
    [SIGNUP_SET_EMAIL](state, email) {
      state.email = email;
    },

    [SIGNUP_SET_PASSWORD](state, password) {
      state.password = password;
    },
  },
};
