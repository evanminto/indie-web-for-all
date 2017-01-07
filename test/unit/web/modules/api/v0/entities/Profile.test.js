const Profile = require('../../../../../../../src/web/modules/api/v0/entities/Profile').default;

describe('Profile', () => {
  describe('constructor()', () => {
    let profile;

    beforeEach(() => {
      profile = new Profile({
        id: 1234,
        username: 'vamptvo',
      });
    });

    it('sets id', () => {
      expect(profile.id).toBe(1234);
    });

    it('sets username', () => {
      expect(profile.username).toBe('vamptvo');
    });
  });
});
