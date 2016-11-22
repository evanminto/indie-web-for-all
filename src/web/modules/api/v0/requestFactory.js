import 'isomorphic-fetch';
import currentSession from '../../currentSession';

import config from '../../../../../config/client/config';

class RequestFactory {
  constructor() {
    this.baseUrl = config.baseUrl;
  }

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

  getUserById(id) {
    return new Request(this.generateUrl(`/api/v0/users/${id}`), {
      method: 'GET',
    });
  }

  getUserAccessToken({ email, password }) {
    const encodedCreds = btoa(`${email}:${password}`);

    return new Request(this.generateUrl(`/api/v0/users/access_tokens`), {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encodedCreds}`,
      },
    });
  }

  verifyUserAccessToken(token, userId) {
    return new Request(this.generateUrl(`/api/v0/users/access_tokens?token=${token}&user_id=${userId}`), {
      method: 'GET',
    });
  }

  getProfile() {
    return new Request(this.generateUrl(`/api/v0/users/${currentSession.userId}/profile`), {
      method: 'GET',
    });
  }

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
      method: 'POST',
      body: body,
      headers: {
        'Authorization': `Bearer ${currentSession.userAccessToken}`,
      }
    });
  }

  generateUrl(path) {
    return this.baseUrl + path;
  }
}

export default new RequestFactory();
