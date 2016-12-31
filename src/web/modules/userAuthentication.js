import cookies from 'js-cookies';

import currentSession from './currentSession';
import inBrowser from './inBrowser';

const TOKEN_COOKIE_NAME = 'user_access_token';

/**
 * Facade for managing authentication state for users of the app.
 */
class UserAuthentication {
  /**
   * @param  {Session} session
   */
  constructor(session) {
    this.session = session;
  }

  /**
   * @type Boolean
   * @readOnly
   */
  get isLoggedIn() {
    return this.session.isActive;
  }

  /**
   * Attempts to log the user in with a provided email and password.
   * If successful, this will start a new session.
   *
   * @param  {String} email
   * @param  {String} password
   * @return {Boolean}          true if the user is logged in
   */
  async logIn(email, password) {
    const success = await currentSession.start(email, password);

    if (success && inBrowser) {
      saveSessionToCookie(this.session);
    }

    return success;
  }

  /**
   * Logs the user out by ending the current session.
   */
  logOut() {
    this.session.end();

    if (inBrowser) {
      saveSessionToCookie(this.session);
    }
  }

  /**
   * Attempts to continue a session using either a provided access token
   * or a fallback value stored in a cookie.
   *
   * @param  {String} [token]
   * @return {Boolean}      true if the user is still logged in
   */
  async continueSession(token) {
    let selectedUserAccessToken = token;

    if (!selectedUserAccessToken && inBrowser) {
      selectedUserAccessToken = cookies.getItem(TOKEN_COOKIE_NAME);
    }

    if (selectedUserAccessToken) {
      return this.session.continue(selectedUserAccessToken);
    }
  }
}

/**
 * Saves enough data about the session to the browser cookie to enable continuing the session
 * later.
 *
 * @param  {Session} session
 * @private
 */
function saveSessionToCookie(session) {
  cookies.setItem(
    TOKEN_COOKIE_NAME,
    session.userAccessToken,
    { secure: true },
  );
}

export default new UserAuthentication(currentSession);
