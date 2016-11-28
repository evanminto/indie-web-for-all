jest.mock('../../../../../src/api/modules/users/User', () => {
  return function User(model) {
    this.model = model;
  };
});

const ProfileLink = jest.fn();

jest.mock('../../../../../src/api/modules/users/ProfileLink', () => ProfileLink);

const Profile = require('../../../../../src/api/modules/users/Profile').default;

describe('Profile', () => {
  describe('username', () => {
    let profile;

    beforeEach(() => {
      profile = new Profile({
        username: 'Edmond Dantes',
      });
    });

    it('gets the model value', () => {
      expect(profile.username).toEqual('Edmond Dantes');
    });

    it('sets the model value', () => {
      const expected = 'The Count of Monte Cristo';

      profile.username = expected;

      expect(profile.username).toEqual(expected);
    });
  });

  describe('getLinks()', () => {
    it('resolves to an array of ProfileLink instances', () => {
      const expectedValue = [
        {
          a: 1,
          b: 2,
        },
        {
          c: 3,
          d: 4,
        }
      ];

      const profile = new Profile({
        getLinks() {
          return Promise.resolve(expectedValue);
        },
      });

      return profile.getLinks()
        .then((links) => {
          expect(links.length).toEqual(2);

          links.forEach((link, index) => {
            expect(link).toBeInstanceOf(ProfileLink);
            expect(ProfileLink).toBeCalledWith(expectedValue[index]);
          });
        });
    });
  });
});
