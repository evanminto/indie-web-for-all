jest.mock('../../../../../src/api/modules/users/AccessToken', () => {
  return function AccessToken(model) {
    this.model = model;
  };
});

const User = require('../../../../../src/api/modules/users/User').default;

describe('User', () => {
  describe('getAccessToken()', () => {
    it('resolves to AccessToken instance', () => {
      const expectedValue = {
        a: 1,
        b: 2,
      };
      const user = new User({
        getAccessTokens() {
          return Promise.resolve([expectedValue]);
        },
      });

      return user.getAccessToken()
        .then((token) => {
          expect(token.model).toEqual(expectedValue);
        });
    });
  });
});
