import config from '../../../../../../config/client';

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

  describe('createUserAccessToken()', () => {
    const email = 'test@example.com';
    const password = 'asdf';

    const request = apiRequestFactory.createUserAccessToken({
      email,
      password,
    });

    it('sets a URL', () => {
      expect(request.url).toEqual(`${config.baseUrl}/api/v0/user_access_tokens`);
    });

    it('sets POST as method', () => {
      expect(request.method).toEqual('POST');
    });
  });

  describe('getUserAccessToken()', () => {
    const token = 'asdfasdf';

    const request = apiRequestFactory.getUserAccessToken(token);

    it('sets a URL', () => {
      expect(request.url).toEqual(`${config.baseUrl}/api/v0/user_access_tokens/${token}`);
    });

    it('sets GET as method', () => {
      expect(request.method).toEqual('GET');
    });
  });

  describe('getProfileByUserId()', () => {
    const id = 5678;
    const request = apiRequestFactory.getProfileByUserId(id);

    it('sets a URL', () => {
      expect(request.url).toEqual(`${config.baseUrl}/api/v0/users/${id}/profile`);
    });

    it('sets GET as method', () => {
      expect(request.method).toEqual('GET');
    });
  });

  describe('getProfilesByUsername()', () => {
    const username = 'vamptvo';
    const request = apiRequestFactory.getProfilesByUsername(username);

    it('sets a URL', () => {
      expect(request.url).toEqual(`${config.baseUrl}/api/v0/profiles?username=${username}`);
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

      it('sets PATCH as method', () => {
        expect(request.method).toEqual('PATCH');
      });

      it('sets the FormData as body', () => {
        expect(request.body).toEqual(data);
      });
    });
  });

  describe('addProfileLink()', () => {
    describe('when passed FormData', () => {
      const data = new FormData();
      data.append('foo', 'bar');

      const request = apiRequestFactory.addProfileLink(data);

      it('sets a URL', () => {
        expect(request.url).toEqual(`${config.baseUrl}/api/v0/users/1234/profile/links`);
      });

      it('sets POST as method', () => {
        expect(request.method).toEqual('POST');
      });

      it('sets the FormData as body', () => {
        expect(request.body).toEqual(data);
      });
    });
  });

  describe('createNote()', () => {
    const profileId = 1234;
    const note = {
      content: 'Lorem Ipsum',
    };

    const request = apiRequestFactory.createNote(profileId, note);

    it('sets a URL', () => {
      expect(request.url).toEqual(`${config.baseUrl}/api/v0/profiles/1234/notes`);
    });

    it('sets POST as method', () => {
      expect(request.method).toEqual('POST');
    });
  });

  describe('getNotesByProfileId()', () => {
    const profileId = 1234;

    const request = apiRequestFactory.getNotesByProfileId(profileId);

    it('sets a URL', () => {
      expect(request.url).toEqual(`${config.baseUrl}/api/v0/profiles/1234/notes`);
    });

    it('sets GET as method', () => {
      expect(request.method).toEqual('GET');
    });
  });
});
