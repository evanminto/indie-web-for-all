const MockProfile = jest.genMockFromModule(
  '../../../../../../src/web/modules/api/v0/entities/Profile'
);

jest.mock('../../../../../../src/web/modules/api/v0/entities/Profile', () => MockProfile);

let mockRequestFactory;

jest.mock('../../../../../../src/web/modules/api/v0/requestFactory', () => {
  mockRequestFactory = jest.genMockFromModule(
    '../../../../../../src/web/modules/api/v0/requestFactory'
  );

  return mockRequestFactory;
});

window.fetch = jest.fn();

const client = require('../../../../../../src/web/modules/api/v0/client').default;

describe('v0 ApiClient', () => {
  describe('getProfileByUsername()', () => {
    let result;

    beforeEach(() => {
      mockRequestFactory.default.getProfilesByUsername.mockImplementation((username) => {
        return { username };
      });

      window.fetch.mockImplementation(async (request) => {
        const items = [];

        if (request.username === 'vamptvo') {
          items.push({
            username: 'vamptvo',
          });
        }

        return {
          ok: true,
          async json() {
            return items;
          },
        };
      });
    });

    describe('when passing a valid username', () => {
      describe('return value', () => {
        beforeEach(async () => {
          result = await client.getProfileByUsername('vamptvo');
        });

        it('is an instance of Profile', () => {
          expect(result).toBeInstanceOf(MockProfile.default);
        });

        it('invokes Profile constructor with the data', () => {
          expect(MockProfile.default).toBeCalledWith({
            username: 'vamptvo',
          });
        });
      });
    });

    describe('when passing an invalid username', () => {
      describe('return value', () => {
        beforeEach(async () => {
          result = await client.getProfileByUsername('evanminto');
        });

        it('is null', () => {
          expect(result).toBeNull();
        });
      });
    });
  });
});
