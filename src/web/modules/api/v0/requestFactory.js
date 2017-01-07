import 'isomorphic-fetch';

import config from '../../../../../config/client';
import currentSession from '../../currentSession';

/**
 * Generates Requests for the REST API.
 *
 * @see [Request on MDN]{@link ___}
 */
class RequestFactory {
  constructor() {
    this.baseUrl = config.baseUrl;
  }

  /**
   * @param  {Object} data
   * @return {Request}
   */
  createUser(data) {
    let body;

    if (data instanceof FormData) {
      body = data;
    } else {
      body = new FormData();

      for (let prop in data) {
        if (data.hasOwnProperty(prop)) {
          body.append(prop, data[prop]);
        }
      }
    }

    return new Request(this.generateUrl('/api/v0/users'), {
      method: 'POST',
      body: body,
    });
  }

  /**
   * @param  {Number} id
   * @return {Request}
   */
  getUserById(id) {
    return new Request(this.generateUrl(`/api/v0/users/${id}`), {
      method: 'GET',
    });
  }

  /**
   * @param  {Object} data
   * @param  {String} data.email
   * @param  {String} data.password
   * @return {Request}
   */
  createUserAccessToken({ email, password }) {
    const encodedCreds = btoa(`${email}:${password}`);

    return new Request(this.generateUrl(`/api/v0/user_access_tokens`), {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCreds}`,
      },
    });
  }

  /**
   * @param  {String} token
   * @return {Request}
   */
  getUserAccessToken(token) {
    return new Request(this.generateUrl(`/api/v0/user_access_tokens/${token}`), {
      method: 'GET',
    });
  }

  /**
   * @param {Number} userId
   * @return {Request}
   */
  getProfileByUserId(userId) {
    return new Request(this.generateUrl(`/api/v0/users/${userId}/profile`), {
      method: 'GET',
    });
  }

  /**
   * @param {String} username
   * @return {Request}
   */
  getProfilesByUsername(username) {
    return new Request(this.generateUrl(`/api/v0/profiles?username=${username}`), {
      method: 'GET',
    });
  }

  /**
   * @param {Number|String} id
   * @return {Request}
   */
  getProfileLinksByProfileId(id) {
    return new Request(this.generateUrl(`/api/v0/profiles/${id}/links`), {
      method: 'GET',
    });
  }

  /**
   * @return {Request}
   */
  getProfileLinks() {
    return new Request(this.generateUrl(`/api/v0/users/${currentSession.userId}/profile/links`), {
      method: 'GET',
    });
  }

  /**
   * @param  {Object} data
   * @return {Request}
   */
  updateProfile(data) {
    let body;

    if (data instanceof FormData) {
      body = data;
    } else {
      body = new FormData();

      for (let prop in data) {
        if (data.hasOwnProperty(prop)) {
          body.append(prop, data[prop]);
        }
      }
    }

    return new Request(this.generateUrl(`/api/v0/users/${currentSession.userId}/profile`), {
      method: 'PATCH',
      body: body,
      headers: {
        'Authorization': `Bearer ${currentSession.userAccessToken}`,
      }
    });
  }

  /**
   * @param  {Object} data
   * @return {Request}
   */
  addProfileLink(data) {
    let body;

    if (data instanceof FormData) {
      body = data;
    } else {
      body = new FormData();

      for (let prop in data) {
        if (data.hasOwnProperty(prop)) {
          body.append(prop, data[prop]);
        }
      }
    }

    return new Request(this.generateUrl(`/api/v0/users/${currentSession.userId}/profile/links`), {
      method: 'POST',
      body: body,
      headers: {
        'Authorization': `Bearer ${currentSession.userAccessToken}`,
      }
    });
  }

  /**
   * Takes an API route and generates a full API URL using the base URL.
   *
   * @param  {String} path
   * @return {String}
   * @private
   */
  generateUrl(path) {
    return this.baseUrl + path;
  }
}

export default new RequestFactory();
