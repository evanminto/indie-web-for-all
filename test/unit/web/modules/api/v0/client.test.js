const MockProfile = jest.genMockFromModule(
  '../../../../../../src/web/modules/api/v0/entities/Profile',
);

jest.mock('../../../../../../src/web/modules/api/v0/entities/Profile', () => MockProfile);

const MockProfileLink = jest.genMockFromModule(
  '../../../../../../src/web/modules/api/v0/entities/ProfileLink',
);

jest.mock('../../../../../../src/web/modules/api/v0/entities/ProfileLink', () => MockProfileLink);

let mockRequestFactory;

jest.mock('../../../../../../src/web/modules/api/v0/requestFactory', () => {
  mockRequestFactory = jest.genMockFromModule(
    '../../../../../../src/web/modules/api/v0/requestFactory',
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

  describe('getProfileLinksByProfileId()', () => {
    let profiles;

    beforeEach(() => {
      mockRequestFactory.default.getProfileLinksByProfileId.mockImplementation((id) => {
        return { id };
      });

      window.fetch.mockImplementation(async (request) => {
        const items = [];

        if (request.id === 1234) {
          items.push({
            url: 'http://example.com/1',
            name: 'One',
            rel: 'me',
          });

          items.push({
            url: 'http://example.com/2',
            name: 'Two',
            rel: 'me',
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

    describe('when passing a valid ID', () => {
      describe('return value', () => {
        beforeEach(async () => {
          profiles = await client.getProfileLinksByProfileId(1234);
        });

        it('is an instance of ProfileLink', () => {
          profiles.forEach((profile) => {
            expect(profile).toBeInstanceOf(MockProfileLink.default);
          });
        });

        it('invokes ProfileLink constructor with the data', () => {
          expect(MockProfileLink.default).toBeCalledWith({
            url: 'http://example.com/1',
            name: 'One',
            rel: 'me',
          });

          expect(MockProfileLink.default).toBeCalledWith({
            url: 'http://example.com/2',
            name: 'Two',
            rel: 'me',
          });
        });
      });
    });

    describe('when passing an invalid ID', () => {
      describe('return value', () => {
        beforeEach(async () => {
          profiles = await client.getProfileLinksByProfileId(4321);
        });

        it('is an empty array', () => {
          expect(profiles).toEqual([]);
        });
      });
    });
  });
});
