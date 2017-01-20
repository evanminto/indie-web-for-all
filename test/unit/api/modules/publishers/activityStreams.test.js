const mockConfig = {
  baseUrl: 'http://example.com',
};

jest.mock('../../../../../config/client', () => mockConfig);

const activityStreamsPublisher = require(
  '../../../../../src/api/modules/publishers/activityStreams',
).default;

describe('ActivityStreamsPublisher', () => {
  describe('publishProfile()', () => {
    let result;

    beforeEach(() => {
      result = activityStreamsPublisher.publishProfile({
        username: 'vamptvo',
      });
    });

    it('sets context', () => {
      expect(result['@context']).toEqual('https://www.w3.org/ns/activitystreams');
    });

    it('sets type to Person', () => {
      expect(result['type']).toEqual('Person');
    });

    it('sets id to the url', () => {
      expect(result['id']).toEqual(`${mockConfig.baseUrl}/vamptvo`);
    });

    it('sets name to username', () => {
      expect(result.name).toEqual('vamptvo');
    });
  });
});
