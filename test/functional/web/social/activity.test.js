import db from '../../../../src/api/db';
import requestFacade from '../../../requestFacade';
import start from '../../../server';

describe('/:username/activities/:activityId', () => {
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

      const actor = await db.Actor.create();
      profile.actor_id = actor.id;
      await profile.save();

      const activity = await db.Activity.create({
        actor_id: actor.id,
        type: 'Create',
      });

      const object = await db.ActivityObject.create({
        type: 'Note',
      });

      activity.object_id = object.id;
      activity.save();

      await db.Note.create({
        content: 'Lorem Ipsum',
        object_id: object.id,
      });

      url = `http://localhost:3000/vamptvo/activities/${activity.id}`;

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
      expect(data.summary).toBeDefined();
    });
  });
});
