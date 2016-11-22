import config from '../../../../../../config/client/config';

jest.mock('../../../../../../src/web/modules/currentSession', () => {
  return {
    userId: 1234,
    accessToken: 'fdsa',
  };
});

const apiRequestFactory = require('../../../../../../src/web/modules/api/v0/requestFactory').default;

// Mock Request
window.Request = class Request {
  constructor(url, { method, body }) {
    this.url = url;
    this.method = method;
    this.body = body;
  }
};

describe('API v0 Request Factory', () => {
  describe('createUser()', () => {
    describe('when passed FormData', () => {
      const data = new FormData();
      data.append('foo', 'bar');

      const request = apiRequestFactory.createUser(data);

      it('sets a URL', () => {
        expect(request.url).toEqual(`${config.baseUrl}/api/v0/users`);
      });

      it('sets POST as method', () => {
        expect(request.method).toEqual('POST');
      });

      it('sets the FormData as body', () => {
        expect(request.body).toEqual(data);
      });
    });
  });

  describe('getUserById()', () => {
    const id = 123;
    const request = apiRequestFactory.getUserById(id);

    it('sets a URL', () => {
      expect(request.url).toEqual(`${config.baseUrl}/api/v0/users/${id}`);
    });

    it('sets GET as method', () => {
      expect(request.method).toEqual('GET');
    });
  });

  describe('getUserAccessToken()', () => {
    const email = 'test@example.com';
    const password = 'asdf';

    const request = apiRequestFactory.getUserAccessToken({
      email,
      password,
    });

    it('sets a URL', () => {
      expect(request.url).toEqual(`${config.baseUrl}/api/v0/users/access_tokens`);
    });

    it('sets GET as method', () => {
      expect(request.method).toEqual('GET');
    });
  });

  describe('verifyUserAccessToken()', () => {
    const token = 'asdfasdf';
    const userId = 1;

    const request = apiRequestFactory.verifyUserAccessToken(token, userId);

    it('sets a URL', () => {
      expect(request.url).toEqual(`${config.baseUrl}/api/v0/users/access_tokens?token=${token}&user_id=${userId}`);
    });

    it('sets GET as method', () => {
      expect(request.method).toEqual('GET');
    });
  });

  describe('getProfile()', () => {
    const request = apiRequestFactory.getProfile();

    it('sets a URL', () => {
      expect(request.url).toEqual(`${config.baseUrl}/api/v0/users/1234/profile`);
    });

    it('sets GET as method', () => {
      expect(request.method).toEqual('GET');
    });
  });

  describe('updateProfile()', () => {
    describe('when passed FormData', () => {
      const data = new FormData();
      data.append('foo', 'bar');

      const request = apiRequestFactory.updateProfile(data);

      it('sets a URL', () => {
        expect(request.url).toEqual(`${config.baseUrl}/api/v0/users/1234/profile`);
      });

      it('sets POST as method', () => {
        expect(request.method).toEqual('POST');
      });

      it('sets the FormData as body', () => {
        expect(request.body).toEqual(data);
      });
    });
  });
});
