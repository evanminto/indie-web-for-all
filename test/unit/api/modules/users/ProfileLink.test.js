const ProfileLink = require('../../../../../src/api/modules/users/ProfileLink').default;

describe('ProfileLink', () => {
  it('has a url property', () => {
    const url = 'http://example.com';
    const link = new ProfileLink({ url });
    expect(link.url).toEqual(url);
  });

  it('has a name property', () => {
    const name = 'http://example.com';
    const link = new ProfileLink({ name });
    expect(link.name).toEqual(name);
  });

  it('has a rel property', () => {
    const rel = 'http://example.com';
    const link = new ProfileLink({ rel });
    expect(link.rel).toEqual(rel);
  });
});
