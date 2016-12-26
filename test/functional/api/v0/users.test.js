import request from 'request';
import HttpStatuses from 'http-status-codes';

import start from '../../../server';

describe('API v0', () => {
  describe('POST /users', () => {
    it('creates a new user', () => {
      return start()
        .then((server) => {
          return new Promise((resolve) => {
            const dateString = Date.now();

            request.post({
              url: 'http://localhost:3000/api/v0/users',
              form: {
                email: `evan+${dateString}@example.com`,
                password: 'asdfasdf',
              },
            }, (error, response, body) => {
              expect(error).toBeFalsy();

              const data = JSON.parse(body);

              expect(data.id).toBeTruthy();
              expect(data.email).toEqual(`evan+${dateString}@example.com`);

              server.close();
              resolve();
            });
          });
        });
    });
  });

  describe('POST /users, then GET /users/access_tokens', () => {
    it('creates and gets a user', () => {
      return start(true)
        .then((server) => {
          const dateString = Date.now();
          const email = `evan+${dateString}@example.com`;
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
                  url: `http://localhost:3000/api/v0/users/access_tokens`,
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

                  server.close();
                  resolve();
                });
              });
            });
        });
    });
  });

  describe('GET /users/access_tokens with invalid token', () => {
    it('returns an Unauthorized response', async () => {
      const server = await start(true);

      await new Promise((resolve) => {
        request({
          url: 'http://localhost:3000/api/v0/users/access_tokens?token=asdfasdf&user_id=1234',
        }, (error, response, body) => {
          expect(error).toBeFalsy();
          expect(response.statusCode).toEqual(HttpStatuses.NOT_FOUND);

          resolve();
        });
      });

      server.close();
    });
  });
});
