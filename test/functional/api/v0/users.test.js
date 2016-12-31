import request from 'request';
import HttpStatuses from 'http-status-codes';

import start from '../../../server';

let server;

describe('API v0', () => {
  describe('POST /users', () => {
    const email = `evan.minto@gmail.com`;
    const password = 'asdfasdf';

    let data;

    beforeEach(async () => {
      server = await start(true);

      await new Promise((resolve) => {
        request.post({
          url: 'http://localhost:3000/api/v0/users',
          form: {
            email,
            password,
          },
        }, (error, response, body) => {
          expect(error).toBeFalsy();

          data = JSON.parse(body);
          resolve();
        });
      });
    });

    it('creates a new user', () => {
      expect(data.id).toBeTruthy();
      expect(data.email).toEqual(email);
    });

    describe('POST /user_access_tokens', () => {
      let userId;
      let response;

      beforeEach(async () => {
        userId = data.id;
        data = undefined;

        await new Promise((resolve) => {
          request.post({
            url: `http://localhost:3000/api/v0/user_access_tokens`,
            auth: {
              password,
              user: email,
            },
          }, (error, res, body) => {
            expect(error).toBeFalsy();
            response = res;
            data = JSON.parse(body);
            resolve();
          });
        });
      });

      it('creates an access token', () => {
        expect(response.statusCode).toEqual(200);
        expect(data.userId).toEqual(userId);
        expect(data.token).toBeTruthy();
      });

      describe('GET /user_access_tokens with the provided token', () => {
        beforeEach(async () => {
          const tokenValue = data.token;

          response = undefined;
          data = undefined;

          await new Promise((resolve) => {
            request({
              url: `http://localhost:3000/api/v0/user_access_tokens/${tokenValue}`,
            }, (error, res, body) => {
              expect(error).toBeFalsy();
              response = res;
              data = JSON.parse(body);
              resolve();
            });
          });
        });

        it('returns user ID', () => {
          expect(response).toBeTruthy();
          expect(data).toBeTruthy();
          expect(response.statusCode).toEqual(200);
          expect(data.userId).toEqual(userId);
          expect(data.token).toBeTruthy();
        });
      });
    });

    afterEach(() => {
      server.close();
    });
  });

  describe('GET /user_access_tokens with invalid token', () => {
    it('returns an Unauthorized response', async () => {
      const server = await start(true);

      await new Promise((resolve) => {
        request({
          url: 'http://localhost:3000/api/v0/user_access_tokens/asdfasdf',
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
