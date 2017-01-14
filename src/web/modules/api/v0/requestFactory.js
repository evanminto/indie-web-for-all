import 'isomorphic-fetch';
import FormDataPolyfill from 'form-data';

import config from '../../../../../config/client';
import currentSession from '../../currentSession';

// Polyfill FormData in Node env
let FormData = (global || window).FormData || null;

if (!FormData) {
  FormData = FormDataPolyfill;
}

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
    return new Request(this.generateUrl('/api/v0/users'), {
      method: 'POST',
      body: getBody(data),
    });
  }

  /**
   * @param  {Number} id
   * @return {Request}
   */
  getUserById(id) {
    return this.get(`/api/v0/users/${id}`);
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
    return this.get(`/api/v0/user_access_tokens/${token}`);
  }

  /**
   * @param {Number} userId
   * @return {Request}
   */
  getProfileByUserId(userId) {
    return this.get(`/api/v0/users/${userId}/profile`);
  }

  /**
   * @param {String} username
   * @return {Request}
   */
  getProfilesByUsername(username) {
    return this.get(`/api/v0/profiles?username=${username}`);
  }

  /**
   * @param {Number|String} id
   * @return {Request}
   */
  getProfileLinksByProfileId(id) {
    return this.get(`/api/v0/profiles/${id}/links`);
  }

  /**
   * @return {Request}
   */
  getProfileLinks() {
    return this.get(`/api/v0/users/${currentSession.userId}/profile/links`);
  }

  /**
   * @param  {Object} data
   * @return {Request}
   */
  updateProfile(data) {
    return this.authenticatedPatch(`/api/v0/users/${currentSession.userId}/profile`, data);
  }

  /**
   * @param  {Object} data
   * @return {Request}
   */
  addProfileLink(data) {
    return this.authenticatedPost(`/api/v0/users/${currentSession.userId}/profile/links`, data);
  }

  /**
   * @param  {Number} profileId
   * @param  {Object} data
   * @param  {String} data.content
   * @return {Request}
   */
  createNote(profileId, data) {
    return this.authenticatedPost(`/api/v0/profiles/${profileId}/notes`, data);
  }

  /**
   * @param  {Number} profileId
   * @return {Request}
   */
  getNotesByProfileId(profileId) {
    return this.get(`/api/v0/profiles/${profileId}/notes`);
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

  /**
   * Generate an unauthenticated GET request
   *
   * @param  {String} path
   * @return {Request}
   */
  get(path) {
    return new Request(this.generateUrl(path), {
      method: 'GET',
    });
  }

  /**
   * Generate a POST request with user auth.
   *
   * @param  {String} path
   * @param  {Object} data
   * @return {Request}
   */
  authenticatedPost(path, data) {
    return new Request(this.generateUrl(path), {
      body: getBody(data),
      method: 'POST',
      headers: {
        Authorization: `Bearer ${currentSession.userAccessToken}`,
      },
    });
  }

  /**
   * Generate a PATCH request with user auth.
   *
   * @param  {String} path
   * @param  {Object} data
   * @return {Request}
   */
  authenticatedPatch(path, data) {
    return new Request(this.generateUrl(path), {
      body: getBody(data),
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${currentSession.userAccessToken}`,
      },
    });
  }
}

function getBody(data) {
  let body;

  if (data instanceof FormData) {
    body = data;
  } else {
    body = new FormData();

    Object.keys(data).forEach((key) => {
      body.append(key, data[key]);
    });
  }

  return body;
}

export default new RequestFactory();
