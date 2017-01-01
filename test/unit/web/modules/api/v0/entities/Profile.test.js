const Profile = require('../../../../../../../src/web/modules/api/v0/entities/Profile').default;

describe('Profile', () => {
  describe('constructor()', () => {
    it('sets username', () => {
      const profile = new Profile({
        username: 'vamptvo',
      });

      expect(profile.username).toEqual('vamptvo');
    });
  });
});
