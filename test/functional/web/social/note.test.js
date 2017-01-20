import db from '../../../../src/api/db';
import requestFacade from '../../../requestFacade';
import start from '../../../server';

describe('/:username/notes/:noteId', () => {
  let server;

  beforeEach(async () => {
    server = await start(true);
  });

  afterEach(() => {
    server.close();
  });

  describe('GET with Accept: application/ld+json; profile="https://www.w3.org/ns/activitystreams#"', () => {
    let error;
    let response;
    let body;
    let url;

    beforeEach(async () => {
      const profile = await db.Profile.create({
        username: 'vamptvo',
      });

      const note = await db.Note.create({
        content: 'Lorem Ipsum',
        profile_id: profile.id,
      });

      url = `http://localhost:3000/vamptvo/notes/${note.id}`;

      const result = await requestFacade.get({
        url,
        headers: {
          Accept: 'application/ld+json; profile="https://www.w3.org/ns/activitystreams#"',
        },
      });

      error = result.error;
      response = result.response;
      body = result.body;
    });

    it('returns the activity', () => {
      expect(error).toBeFalsy();
      expect(response.statusCode).toEqual(200);

      const data = JSON.parse(body);
      expect(data.id).toBe(url);
      expect(data.content).toBe('Lorem Ipsum');
    });
  });
});
