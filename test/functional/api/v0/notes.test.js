import request from 'request';

import requestFacade from '../../../requestFacade';
import start from '../../../server';

describe('API v0', () => {
  let profileId;
  let token;
  let server;

  beforeEach(async () => {
    server = await start(true);
    const credentials = await signUpAndLogIn();
    const profile = await getProfileByUserId(credentials.userId);
    profileId = profile.id;
    token = credentials.token;
  });

  afterEach(() => {
    server.close();
  });

  describe('/profiles/:profile_id/notes', () => {
    describe('GET', () => {
      let error;
      let response;
      let body;

      beforeEach(async () => {
        const result = await requestFacade.get(
          `http://localhost:3000/api/v0/profiles/${profileId}/notes`,
        );

        error = result.error;
        response = result.response;
        body = result.body;
      });

      it('returns an empty collection', () => {
        expect(error).toBeFalsy();
        expect(response.statusCode).toEqual(200);

        const data = JSON.parse(body);

        expect(data.forEach).toBeDefined();
        expect(data.length).toEqual(0);
      });
    });

    describe('POST with content', () => {
      let error;
      let response;
      let body;

      beforeEach(async () => {
        const result = await requestFacade.post({
          url: `http://localhost:3000/api/v0/profiles/${profileId}/notes`,
          auth: {
            bearer: token,
          },
          form: {
            content: 'Lorem Ipsum',
          },
        });

        error = result.error;
        response = result.response;
        body = result.body;
      });

      it('adds a new note', () => {
        expect(error).toBeFalsy();
        expect(response.statusCode).toEqual(200);

        const data = JSON.parse(body);

        expect(data.id).toBeTruthy();
        expect(data.profileId).toBeTruthy();
        expect(data.content).toBe('Lorem Ipsum');
      });

      describe('GET', () => {
        let error;
        let response;
        let body;

        beforeEach(async () => {
          const result = await requestFacade.get(
            `http://localhost:3000/api/v0/profiles/${profileId}/notes`,
          );

          error = result.error;
          response = result.response;
          body = result.body;
        });

        it('returns a collection containing the new note', () => {
          expect(error).toBeFalsy();
          expect(response.statusCode).toEqual(200);

          const data = JSON.parse(body);

          expect(data.forEach).toBeDefined();
          expect(data.length).toBe(1);
          expect(data[0].id).toBeTruthy();
          expect(data[0].content).toBe('Lorem Ipsum');
          expect(data[0].createdAt).toBeTruthy();
          expect(data[0].updatedAt).toBeTruthy();
          expect(data[0].profileId).toBe(profileId);
        });
      });
    });
  });
});

async function signUpAndLogIn(email = 'evan+notes@example.com', password = 'asdfasdf') {
  await new Promise((resolve) => {
    request.post({
      url: 'http://localhost:3000/api/v0/users',
      form: {
        email,
        password,
      },
    }, (error, response, body) => {
      expect(error).toBeFalsy();
      expect(response.statusCode).toEqual(201);

      const data = JSON.parse(body);

      resolve(data.id);
    });
  });

  return new Promise((resolve) => {
    request.post({
      url: 'http://localhost:3000/api/v0/user_access_tokens',
      auth: {
        password,
        user: email,
      },
    }, (error, response, body) => {
      const data = JSON.parse(body);

      resolve(data);
    });
  });
}

async function getProfileByUserId(userId) {
  const result = await requestFacade.get(
    `http://localhost:3000/api/v0/users/${userId}/profile`,
  );

  return JSON.parse(result.body);
}
