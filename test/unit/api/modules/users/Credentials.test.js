jest.mock('../../../../../src/api/modules/users/Account', () => {
  return function Account(model) {
    this.model = model;
  };
});

jest.mock('../../../../../src/api/modules/users/passwordEncoder', () => {
  return {
    generateHash(password, salt) {
      return password + salt;
    },
  };
});

const Credentials = require('../../../../../src/api/modules/users/Credentials').default;

describe('Credentials', () => {
  describe('getAccount()', () => {
    it('resolves to Account instance', () => {
      const expectedValue = {
        a: 1,
        b: 2,
      };

      const credentials = new Credentials({
        getAccount() {
          return Promise.resolve(expectedValue);
        },
      });

      return credentials.getAccount()
        .then((account) => {
          expect(account.model).toEqual(expectedValue);
        });
    });
  });

  describe('passwordMatches()', () => {
    it('returns true when the password generates the right hash', () => {
      const credentials = new Credentials({
        hash: 'foobar',
        salt: 'bar',
      });

      const matches = credentials.passwordMatches('foo');

      expect(matches).toBeTruthy();
    });

    it('returns false when the password generates the wrong hash', () => {
      const credentials = new Credentials({
        hash: 'foobar',
        salt: 'bar',
      });

      const matches = credentials.passwordMatches('oof');

      expect(matches).toBeFalsy();
    });
  });
});
