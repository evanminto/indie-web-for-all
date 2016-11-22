jest.mock('../../../../../src/api/modules/users/User', () => {
  return function User(model) {
    this.model = model;
  };
});

const AccessToken = require('../../../../../src/api/modules/users/AccessToken').default;

describe('AccessToken', () => {
  describe('getUser()', () => {
    it('resolves to User instance', () => {
      const expectedValue = {
        a: 1,
        b: 2,
      };
      const token = new AccessToken({
        getUser() {
          return Promise.resolve(expectedValue);
        },
      });

      return token.getUser()
        .then((user) => {
          expect(user.model).toEqual(expectedValue);
        });
    });
  });
});
