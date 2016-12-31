import { SESSION_SET_CREDS, SESSION_CLEAR } from '../vue/store/mutationTypes';
import requestFactory from './api/v0/requestFactory';
import store from '../vue/store';

/**
 * A user's current usage session.
 */
class Session {
  /**
   * @type {Number}
   * @readOnly
   */
  get userId() {
    return store.state.currentSession.userId;
  }

  /**
   * @type {String}
   * @readOnly
   */
  get userAccessToken() {
    return store.state.currentSession.userAccessToken;
  }

  /**
   * @type {Boolean}
   * @readOnly
   */
  get isActive() {
    return Boolean(this.userAccessToken && this.userId);
  }

  /**
   * Attempts to start a new session using a provided email and password.
   *
   * @param  {String} email
   * @param  {String} password
   * @return {Promise.<Boolean>} true if the session was successfully started, false if not
   */
  async start(email, password) {
    const request = requestFactory.createUserAccessToken({
      email,
      password,
    });

    const response = await fetch(request);

    if (response.ok) {
      const data = await response.json();

      store.commit(SESSION_SET_CREDS, {
        userId: data.userId,
        accessToken: data.token
      });

      return true;
    }

    return false;
  }

  /**
   * Attempts to use an existing session.
   *
   * @return {Promise.<Boolean>}
   */
  async continue(accessToken) {
    if (accessToken) {
      const request = requestFactory.getUserAccessToken(accessToken);
      const response = await fetch(request);

      // If token is still active, continue using the credentials.
      if (response.ok) {
        const data = await response.json();

        store.commit(SESSION_SET_CREDS, {
          accessToken,
          userId: data.userId,
        });

        return true;
      }
      // If token is no longer active, clear out the credentials.
      else {
        store.commit(SESSION_CLEAR);

        return false;
      }
    }

    return false;
  }

  /**
   * Erases any stored credentials, thus ending the session.
   */
  end() {
    store.commit(SESSION_CLEAR);
  }
}

export default new Session();
