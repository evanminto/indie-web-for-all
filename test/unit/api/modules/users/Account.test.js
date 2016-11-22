jest.mock('../../../../../src/api/modules/users/User', () => {
  return function User(model) {
    this.model = model;
  };
});

jest.mock('../../../../../src/api/modules/users/Credentials', () => {
  return function Credentials(model) {
    this.model = model;
  };
});

const Account = require('../../../../../src/api/modules/users/Account').default;

describe('Account', () => {
  describe('getUser()', () => {
    it('resolves to User instance', () => {
      const expectedValue = {
        a: 1,
        b: 2,
      };

      const account = new Account({
        getUser() {
          return Promise.resolve(expectedValue);
        },
      });

      return account.getUser()
        .then((user) => {
          expect(user.model).toEqual(expectedValue);
        });
    });
  });

  describe('getCredentials()', () => {
    it('resolves to User instance', () => {
      const expectedValue = {
        a: 1,
        b: 2,
      };

      const account = new Account({
        getCredentials() {
          return Promise.resolve(expectedValue);
        },
      });

      return account.getCredentials()
        .then((credentials) => {
          expect(credentials.model).toEqual(expectedValue);
        });
    });
  });
});
