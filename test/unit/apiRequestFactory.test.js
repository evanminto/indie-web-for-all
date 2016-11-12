import config from '../../config/client/config';
import apiRequestFactory from '../../src/apiRequestFactory';

// Mock Request
window.Request = class Request {
  constructor(url, { method, body }) {
    this.url = url;
    this.method = method;
    this.body = body;
  }
};

describe('API Request Factory', () => {
  describe('createCreateUserRequest()', () => {
    describe('when passed FormData', () => {
      const data = new FormData();
      data.append('foo', 'bar');

      const request = apiRequestFactory.createCreateUserRequest(data);

      it('sets a URL', () => {
        expect(request.url).toEqual(`${config.baseUrl}/api/users`);
      });

      it('sets POST as method', () => {
        expect(request.method).toEqual('POST');
      });

      it('sets the FormData as body', () => {
        expect(request.body).toEqual(data);
      });
    });
  });

  describe('createGetUserByIdRequest()', () => {
    const id = 123;
    const request = apiRequestFactory.createGetUserByIdRequest(id);

    it('sets a URL', () => {
      expect(request.url).toEqual(`${config.baseUrl}/api/users/${id}`);
    });

    it('sets GET as method', () => {
      expect(request.method).toEqual('GET');
    });
  });
});
