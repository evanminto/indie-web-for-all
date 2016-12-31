let mockCookies;
let mockCurrentSession;
let mockInBrowser;

createMocks();

const userAuthentication = require('../../../../src/web/modules/userAuthentication').default;

describe('UserAuthentication', () => {
  describe('isLoggedIn', () => {
    it('proxies to session', () => {
      mockCurrentSession.default.isActive = true;
      expect(userAuthentication.isLoggedIn).toBeTruthy();

      mockCurrentSession.default.isActive = false;
      expect(userAuthentication.isLoggedIn).toBeFalsy();
    });
  });

  describe('logIn()', () => {
    let result;

    beforeEach(() => {
      const expectedEmail = 'evan@example.com';
      const expectedPassword = 'password0';

      mockCurrentSession.default.start.mockImplementation(async (email, password) => {
        if (email === expectedEmail && password === expectedPassword) {
          mockCurrentSession.default.userAccessToken = 'asdfasdf';
          return true;
        }

        return false;
      });
    });

    describe('when in browser', () => {
      beforeEach(() => {
        mockInBrowser.default = true;
      });

      describe('when passing correct creds', () => {
        beforeEach(async () => {
          mockCookies.default.setItem.mockReset();
          result = await userAuthentication.logIn('evan@example.com', 'password0');
        });

        it('returns true', () => {
          expect(result).toBeTruthy();
        });

        it('sets the cookie', () => {
          expect(mockCookies.default.setItem).toBeCalledWith(
            'user_access_token',
            mockCurrentSession.default.userAccessToken,
            { secure: true },
          );
        });
      });

      describe('when passing incorrect creds', () => {
        beforeEach(async () => {
          mockCookies.default.setItem.mockReset();
          result = await userAuthentication.logIn('evan2@example.com', 'password1');
        });

        it('returns false', () => {
          expect(result).toBeFalsy();
        });

        it('does not set the cookie', () => {
          expect(mockCookies.default.setItem).not.toBeCalled();
        });
      });
    });

    describe('when not in browser', () => {
      beforeEach(() => {
        mockInBrowser.default = false;
      });

      describe('when passing correct creds', () => {
        beforeEach(async () => {
          mockCookies.default.setItem.mockReset();
          result = await userAuthentication.logIn('evan@example.com', 'password0');
        });

        it('returns true', () => {
          expect(result).toBeTruthy();
        });

        it('does not set the cookie', () => {
          expect(mockCookies.default.setItem).not.toBeCalled();
        });
      });

      describe('when passing incorrect creds', () => {
        beforeEach(async () => {
          mockCookies.default.setItem.mockReset();
          result = await userAuthentication.logIn('evan2@example.com', 'password1');
        });

        it('returns false', () => {
          expect(result).toBeFalsy();
        });

        it('does not set the cookie', () => {
          expect(mockCookies.default.setItem).not.toBeCalled();
        });
      });
    });
  });

  describe('logOut()', () => {
    it('ends the session', () => {
      userAuthentication.logOut();
      expect(mockCurrentSession.default.end).toBeCalled();
    });

    describe('when in browser', () => {
      it('sets the cookie', () => {
        mockCookies.default.setItem.mockReset();
        mockInBrowser.default = true;

        userAuthentication.logOut();

        expect(mockCookies.default.setItem).toBeCalledWith(
          'user_access_token',
          mockCurrentSession.default.userAccessToken,
          { secure: true },
        );
      });
    });

    describe('when not in browser', () => {
      it('does not set the cookie', () => {
        mockCookies.default.setItem.mockReset();
        mockInBrowser.default = false;

        userAuthentication.logOut();

        expect(mockCookies.default.setItem).not.toBeCalled();
      });
    });
  });

  describe('continueSession()', () => {
    let result;

    describe('when passed a token', () => {
      beforeEach(() => {
        mockCurrentSession.default.continue.mockReset();
      });

      it('proxies the return value of Session#continue()', async () => {
        mockCurrentSession.default.continue.mockReturnValue(Promise.resolve(true));
        result = await userAuthentication.continueSession('asdfasdf');
        expect(result).toBeTruthy();

        mockCurrentSession.default.continue.mockReturnValue(Promise.resolve(false));
        result = await userAuthentication.continueSession('asdfasdf');
        expect(result).toBeFalsy();
      });

      it('attempts to continue using the provided token', async () => {
        result = await userAuthentication.continueSession('asdfasdf');
        expect(mockCurrentSession.default.continue).toBeCalledWith('asdfasdf');
      });
    });

    describe('when not passed a token', () => {
      beforeEach(() => {
        mockCurrentSession.default.continue.mockReset();

        mockCookies.default.getItem.mockImplementation((key) => {
          if (key === 'user_access_token') {
            return 'fdsafdsa'
          }

          return undefined;
        });
      });

      describe('when in browser', () => {
        beforeEach(() => {
          mockInBrowser.default = true;
        });

        it('attempts to continue using a token pulled from a cookie', async () => {
          await userAuthentication.continueSession();

          expect(mockCurrentSession.default.continue).toBeCalledWith('fdsafdsa');
        });
      });

      describe('when not in browser', () => {
        beforeEach(() => {
          mockInBrowser.default = false;
        });

        it('cancels the operation', async () => {
          await userAuthentication.continueSession();

          expect(mockCurrentSession.default.continue).not.toBeCalled();
        });
      });
    });
  });
});

function createMocks() {
  mockCookies = jest.genMockFromModule('js-cookies');
  jest.mock('js-cookies', () => mockCookies);

  mockCurrentSession = jest.genMockFromModule('../../../../src/web/modules/currentSession');
  jest.mock('../../../../src/web/modules/currentSession', () => mockCurrentSession);

  mockInBrowser = jest.genMockFromModule('../../../../src/web/modules/inBrowser');
  jest.mock('../../../../src/web/modules/inBrowser', () => mockInBrowser);

  window.fetch = jest.fn();
}
