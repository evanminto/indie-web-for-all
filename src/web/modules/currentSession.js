import cookies from 'js-cookies';

import inBrowser from './inBrowser';
import requestFactory from './api/v0/requestFactory';
import store from '../vue/store';
import { SET_CURRENT_USER_CREDS } from '../vue/store/mutationTypes';

class Session {
  get userId() {
    return cookies.getItem('user_id') || store.state.currentSession.userId;
  }

  get userAccessToken() {
    return cookies.getItem('user_access_token') || store.state.currentSession.userAccessToken;
  }

  checkUserLoggedIn() {
    return new Promise((resolve) => {
      if (!this.userId || !this.userAccessToken) {
        resolve(false);
      }

      const request = requestFactory.verifyUserAccessToken(this.userAccessToken, this.userId);

      return fetch(request)
        .then((response) => {
          if (response.ok) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

  useCredentials(userId, userAccessToken) {
    store.commit(SET_CURRENT_USER_CREDS, {
      id: userId,
      accessToken: userAccessToken,
    });

    if (inBrowser) {
      cookies.setItem('user_id', userId, { secure: true });
      cookies.setItem('user_access_token', userAccessToken, { secure: true });
    }
  }

  async logIn(email, password) {
    const request = requestFactory.getUserAccessToken({
      email,
      password,
    });

    const response = await fetch(request)

    if (response.ok) {
      const data = await response.json();

      this.useCredentials(data.userId, data.token);

      return;
    }

    const data = await response.json();

    return Promise.reject(data);
  }
}

export default new Session();
