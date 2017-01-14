const MockNote = jest.genMockFromModule(
  '../../../../../../src/web/modules/api/v0/entities/Note',
);

jest.mock('../../../../../../src/web/modules/api/v0/entities/Note', () => MockNote);

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

  describe('createNote()', () => {
    let note;

    beforeEach(() => {
      mockRequestFactory.default.createNote.mockImplementation((profileId, note) => {
        return {
          note,
          profileId,
        };
      });

      window.fetch.mockImplementation(async (request) => {
        if (request.profileId === 1234 && request.note.content === 'Lorem Ipsum') {
          return {
            ok: true,
            async json() {
              return Object.assign({}, request.note, {
                id: 1,
              });
            },
          };
        }

        return {
          ok: false,
        };
      });
    });

    describe('when passing a valid profile ID and content', () => {
      describe('return value', () => {
        beforeEach(async () => {
          note = await client.createNote(1234, {
            content: 'Lorem Ipsum',
          });
        });

        it('is an instance of Note', () => {
          expect(note).toBeInstanceOf(MockNote.default);
        });

        it('invokes Note constructor with the data', () => {
          expect(MockNote.default).toBeCalledWith({
            id: 1,
            content: 'Lorem Ipsum',
          });
        });
      });
    });

    describe('when passing an invalid profile ID', () => {
      describe('return value', () => {
        beforeEach(async () => {
          note = await client.createNote(4321, {
            content: 'Lorem Ipsum',
          });
        });

        it('is an error', () => {
          expect(note).toBeNull();
        });
      });
    });

    describe('when passing invalid note data', () => {
      describe('return value', () => {
        beforeEach(async () => {
          note = await client.createNote(4321, {
            content: 'Lorem Ipsum',
          });
        });

        it('is an error', () => {
          expect(note).toBeNull();
        });
      });
    });
  });

  describe('getNotesByProfileId()', () => {
    let notes;

    beforeEach(() => {
      mockRequestFactory.default.getNotesByProfileId.mockImplementation((profileId) => {
        return {
          profileId,
        };
      });

      window.fetch.mockImplementation(async (request) => {
        if (request.profileId === 1234) {
          return {
            ok: true,
            async json() {
              return [
                {
                  id: 1,
                  profileId: request.profileId,
                  content: 'Lorem Ipsum',
                },
                {
                  id: 2,
                  profileId: request.profileId,
                  content: 'Ipsum Lorem',
                },
              ];
            },
          };
        }

        return {
          ok: false,
        };
      });
    });

    describe('when passing a valid profile ID', () => {
      describe('return value', () => {
        beforeEach(async () => {
          notes = await client.getNotesByProfileId(1234);
        });

        it('is an array of Note instances', () => {
          expect(notes.length).toBe(2);

          notes.forEach((note) => {
            expect(note).toBeInstanceOf(MockNote.default);
          });
        });

        it('invokes Note constructor with the data', () => {
          expect(MockNote.default).toBeCalledWith({
            id: 1,
            profileId: 1234,
            content: 'Lorem Ipsum',
          });

          expect(MockNote.default).toBeCalledWith({
            id: 2,
            profileId: 1234,
            content: 'Ipsum Lorem',
          });
        });
      });
    });

    describe('when passing an invalid profile ID', () => {
      describe('return value', () => {
        beforeEach(async () => {
          notes = await client.getNotesByProfileId(4321);
        });

        it('is an empty array', () => {
          expect(notes).toEqual([]);
        });
      });
    });
  });
});
