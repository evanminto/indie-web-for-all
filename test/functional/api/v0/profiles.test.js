import request from 'request';
import start from '../../../server';

describe('API v0', () => {
  describe('POST /users, PATCH /users/:id/profile', () => {
    it('creates a new user and updates their username', () => {
      return signUpAndLogIn()
        .then(({ userId, token, server }) => {
          const username = 'evanminto';

          return new Promise((resolve) => {
            request.patch({
              url: `http://localhost:3000/api/v0/users/${userId}/profile`,
              auth: {
                bearer: token,
              },
              form: {
                username,
              },
            }, (error, response, body) => {
              expect(error).toBeFalsy();
              expect(response.statusCode).toEqual(200);

              const data = JSON.parse(body);

              expect(data.username).toEqual(username);

              server.close();
              resolve(data);
            });
          });
        });
    });
  });

  describe('POST /users, POST /users/:id/profile/links', () => {
    it('creates a new user and updates their profile links', () => {
      return signUpAndLogIn()
        .then(({ userId, token, server }) => {
          const link = {
            url: 'http://example.com',
            name: 'Example',
            rel: 'me',
          };

          return new Promise((resolve) => {
            request.post({
              url: `http://localhost:3000/api/v0/users/${userId}/profile/links`,
              auth: {
                bearer: token,
              },
              form: link,
            }, (error, response, body) => {
              expect(error).toBeFalsy();
              expect(response.statusCode).toEqual(200);

              const data = JSON.parse(body);

              expect(data.id).toBeTruthy();
              expect(data.url).toEqual(link.url);
              expect(data.name).toEqual(link.name);
              expect(data.rel).toEqual(link.rel);

              server.close();
              resolve(data);
            });
          });
        });
    });
  });
});

function signUpAndLogIn() {
  return start(true)
    .then((server) => {
      const dateString = Date.now();
      const email = 'evan@example.com';
      const password = 'asdfasdf';

      return new Promise((resolve) => {
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
      })
        .then((userId) => {
          return new Promise((resolve) => {
            request({
              url: 'http://localhost:3000/api/v0/users/access_tokens',
              auth: {
                password,
                user: email,
              },
            }, (error, response, body) => {
              expect(error).toBeFalsy();
              expect(response.statusCode).toEqual(200);

              const data = JSON.parse(body);

              expect(data.userId).toEqual(userId);
              expect(data.token).toBeTruthy();

              data.server = server;

              resolve(data);
            });
          });
        });
    });
}
