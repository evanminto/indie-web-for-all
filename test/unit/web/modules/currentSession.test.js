import { SESSION_CLEAR, SESSION_SET_CREDS } from '../../../../src/web/vue/store/mutationTypes';

let mockRequestFactory;
let mockStore;

createMocks();

const currentSession = require('../../../../src/web/modules/currentSession').default;

describe('Session', () => {
  describe('userId', () => {
    it('proxies to the store', () => {
      const userId = 1234;

      mockStore.default.state.currentSession.userId = userId;

      expect(currentSession.userId).toEqual(userId);
    });
  });

  describe('userAccessToken', () => {
    it('proxies to the store', () => {
      const userAccessToken = 'asdfasdf';

      mockStore.default.state.currentSession.userAccessToken = userAccessToken;

      expect(currentSession.userAccessToken).toEqual(userAccessToken);
    });
  });

  describe('isActive', () => {
    describe('when access token and user ID are defined', () => {
      it('is true', () => {
        mockStore.default.state.currentSession.userAccessToken = 'asdfasdf';
        mockStore.default.state.currentSession.userId = 1234;

        expect(currentSession.isActive).toBeTruthy();
      });
    });

    describe('when access token and user ID are undefined', () => {
      it('is false', () => {
        mockStore.default.state.currentSession.userAccessToken = undefined;
        mockStore.default.state.currentSession.userId = undefined;

        expect(currentSession.isActive).toBeFalsy();
      });
    });
  });

  describe('start()', () => {
    let result;

    beforeEach(() => {
      const mockRequest = { url: 'http://example.com' };

      mockRequestFactory.default.createUserAccessToken
        .mockImplementation(({ email, password }) => {
          mockRequest.email = email;
          mockRequest.password = password;

          return mockRequest;
        });

      window.fetch.mockImplementation(async (request) => {
        if (request.email === 'evan@example.com' && request.password === 'mypassword0') {
          return {
            ok: true,
            async json() {
              return {
                userId: 1234,
                token: 'asdfasdf',
              };
            },
          };
        }

        return {
          ok: false,
        };
      });
    });

    describe('when email/password are correct', () => {
      beforeEach(async () => {
        result = await currentSession.start('evan@example.com', 'mypassword0');
      });

      it('returns true', () => {
        expect(result).toBeTruthy();
      });

      it('commits to the store', () => {
        expect(mockStore.default.commit).toBeCalledWith(SESSION_SET_CREDS, {
          accessToken: 'asdfasdf',
          userId: 1234,
        });
      });
    });

    describe('when email/password are incorrect', () => {
      beforeEach(async () => {
        mockStore.default.commit.mockReset();
        result = await currentSession.start('evan2@example.com', 'mypassword1');
      });

      it('returns false', () => {
        expect(result).toBeFalsy();
      });

      it("doesn't commit to the store", () => {
        expect(mockStore.default.commit).not.toBeCalled();
      });
    });
  });

  describe('continue()', () => {
    let result;

    beforeEach(() => {
      const mockRequest = { url: 'http://example.com' };

      mockRequestFactory.default.getUserAccessToken
        .mockImplementation((token) => {
          mockRequest.token = token;

          return mockRequest;
        });

      window.fetch.mockImplementation(async (request) => {
        if (request.token === 'asdfasdf') {
          return {
            ok: true,
            async json() {
              return {
                userId: 1234,
                token: 'asdfasdf',
              };
            },
          };
        }

        return {
          ok: false,
        };
      });
    });

    describe('when passing an active token', () => {
      beforeEach(async () => {
        result = await currentSession.continue('asdfasdf');
      });

      it('returns true', () => {
        expect(result).toBeTruthy();
      });

      it('commits to the store', () => {
        expect(mockStore.default.commit).toBeCalledWith(SESSION_SET_CREDS, {
          accessToken: 'asdfasdf',
          userId: 1234,
        });
      });
    });

    describe('when passing an inactive token', () => {
      beforeEach(async () => {
        result = await currentSession.continue('fdsafdsa');
      });

      it('returns false', () => {
        expect(result).toBeFalsy();
      });

      it('commits to the store', () => {
        expect(mockStore.default.commit).toBeCalledWith(SESSION_CLEAR);
      });
    });

    describe('when passing nothing', () => {
      it('returns false', async () => {
        result = await currentSession.continue();

        expect(result).toBeFalsy();
      });
    });
  });

  describe('end()', () => {
    describe('when session has been started', () => {
      beforeEach(() => {
        mockStore.default.state.currentSession.userAccessToken = 'asdfasdf';
        mockStore.default.state.currentSession.userId = 1234;

        currentSession.end();
      });

      it('commits to the store', () => {
        expect(mockStore.default.commit).toBeCalledWith(SESSION_CLEAR);
      });
    });

    describe('when session has not been started', () => {
      beforeEach(() => {
        mockStore.default.state.currentSession.userAccessToken = undefined;
        mockStore.default.state.currentSession.userId = undefined;

        currentSession.end();
      });

      it('commits to the store', () => {
        expect(mockStore.default.commit).toBeCalledWith(SESSION_CLEAR);
      });
    });
  });
});

function createMocks() {
  jest.mock('../../../../src/web/modules/api/v0/requestFactory', () => {
    mockRequestFactory = jest.genMockFromModule(
      '../../../../src/web/modules/api/v0/requestFactory',
    );

    return mockRequestFactory;
  });

  mockStore = jest.genMockFromModule('../../../../src/web/vue/store');

  mockStore.default.state = {
    currentSession: {},
  };

  jest.mock('../../../../src/web/vue/store', () => mockStore);

  window.fetch = jest.fn();
}
