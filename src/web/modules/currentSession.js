import cookies from 'js-cookies';

import inBrowser from './inBrowser';
import requestFactory from './api/v0/requestFactory';
import store from '../vue/store';
import { SET_CURRENT_USER_CREDS } from '../vue/store/mutationTypes';

/**
 * A user's current usage session.
 */
class Session {
  /**
   * @type {Number}
   */
  get userId() {
    return cookies.getItem('user_id') || store.state.currentSession.userId;
  }

  /**
   * @type {String}
   */
  get userAccessToken() {
    return cookies.getItem('user_access_token') || store.state.currentSession.userAccessToken;
  }

  /**
   * @return {Promise.<Boolean>} true if the user is logged in, false if not
   */
  async checkUserLoggedIn() {
    if (!this.userId || !this.userAccessToken) {
      return false;
    }

    const request = requestFactory.verifyUserAccessToken(this.userAccessToken, this.userId);
    const response = await fetch(request);

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Sets the current user credentials to keep the user logged in.
   *
   * @param  {Number} userId
   * @param  {String} userAccessToken
   */
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

  /**
   * Attempts to log the user in using an email and password.
   *
   * @param  {String} email
   * @param  {String} password
   * @return {Promise.<Boolean>} true if the user was successfully logged in, false if not
   */
  async logIn(email, password) {
    const request = requestFactory.getUserAccessToken({
      email,
      password,
    });

    const response = await fetch(request)

    if (response.ok) {
      const data = await response.json();

      this.useCredentials(data.userId, data.token);

      return true;
    }

    return false;
  }
}

export default new Session();
