import 'isomorphic-fetch';

import config from '../config/client/config';

class RequestFactory {
  constructor() {
    this.baseUrl = config.baseUrl;
  }

  createCreateUserRequest(data) {
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

    return new Request(this.generateUrl('/api/users'), {
      method: 'POST',
      body: body,
    });
  }

  createGetUserByIdRequest(id) {
    return new Request(this.generateUrl(`/api/users/${id}`), {
      method: 'GET',
    });
  }

  generateUrl(path) {
    return this.baseUrl + path;
  }
}

export default new RequestFactory();
