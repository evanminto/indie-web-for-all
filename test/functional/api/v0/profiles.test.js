import request from 'request';

import requestFacade from '../../../requestFacade';
import start from '../../../server';

describe('API v0', () => {
  let userId;
  let token;
  let server;

  beforeEach(async () => {
    server = await start(true);
    const data = await signUpAndLogIn();
    userId = data.userId;
    token = data.token;
  });

  afterEach(() => {
    server.close();
  });

  describe('/users/:id/profile', () => {
    describe('GET', () => {
      let error;
      let response;
      let body;

      beforeEach(() => {
        return new Promise((resolve) => {
          request(
            `http://localhost:3000/api/v0/users/${userId}/profile`,
            (responseError, responseData, responseBody) => {
              error = responseError;
              response = responseData;
              body = responseBody;
              resolve();
            }
          );
        });
      });

      it('does not return a username', async () => {
        expect(error).toBeFalsy();
        expect(response.statusCode).toEqual(200);

        const data = JSON.parse(body);

        expect(data.username).toBeFalsy();
      });
    });

    describe('PATCH with no username', () => {
      let error;
      let response;
      let body;

      beforeEach(async () => {
        await new Promise((resolve) => {
          request.patch({
            url: `http://localhost:3000/api/v0/users/${userId}/profile`,
            auth: {
              bearer: token,
            },
          }, (responseError, responseData, responseBody) => {
            error = responseError;
            response = responseData;
            body = responseBody;
            resolve();
          });
        });
      });

      it('leaves username undefined', async () => {
        expect(error).toBeFalsy();
        expect(response.statusCode).toEqual(200);

        const data = JSON.parse(body);

        expect(data.username).toBeFalsy();
      });
    });

    describe('PATCH with username', () => {
      const username = 'evanminto';
      let error;
      let response;
      let body;

      beforeEach(async () => {
        await new Promise((resolve) => {
          request.patch({
            url: `http://localhost:3000/api/v0/users/${userId}/profile`,
            auth: {
              bearer: token,
            },
            form: {
              username,
            },
          }, (responseError, responseData, responseBody) => {
            error = responseError;
            response = responseData;
            body = responseBody;
            resolve();
          });
        });
      });

      it('updates username', () => {
        expect(error).toBeFalsy();
        expect(response.statusCode).toEqual(200);

        const data = JSON.parse(body);

        expect(data.username).toEqual(username);
      });

      describe('GET', () => {
        beforeEach(() => {
          return new Promise((resolve) => {
            request(
              `http://localhost:3000/api/v0/users/${userId}/profile`,
              (responseError, responseData, responseBody) => {
                error = responseError;
                response = responseData;
                body = responseBody;
                resolve();
              }
            );
          });
        });

        it('returns new username', () => {
          expect(error).toBeFalsy();
          expect(response.statusCode).toEqual(200);

          const data = JSON.parse(body);

          expect(data.username).toEqual(username);
        });
      });
    });
  });

  describe('/users/:id/profile/links', () => {
    describe('GET', () => {
      let error;
      let response;
      let body;

      beforeEach(async () => {
        await new Promise((resolve) => {
          request(
            `http://localhost:3000/api/v0/users/${userId}/profile/links`,
            (responseError, responseData, responseBody) => {
              error = responseError;
              response = responseData;
              body = responseBody;
              resolve();
            }
          );
        });
      });

      it('returns an empty collection', () => {
        expect(error).toBeFalsy();
        expect(response.statusCode).toEqual(200);

        const data = JSON.parse(body);

        expect(data.forEach).toBeDefined();
        expect(data.length).toEqual(0);
      });
    });

    describe('POST with url, name, and rel', () => {
      const link = {
        url: 'http://example.com',
        name: 'Example',
        rel: 'me',
      };

      let error;
      let response;
      let body;

      beforeEach(async () => {
        await new Promise((resolve) => {
          request.post({
            url: `http://localhost:3000/api/v0/users/${userId}/profile/links`,
            auth: {
              bearer: token,
            },
            form: link,
          }, (responseError, responseData, responseBody) => {
            error = responseError;
            response = responseData;
            body = responseBody;
            resolve();
          });
        });
      });

      it('adds a new profile link', () => {
        expect(error).toBeFalsy();
        expect(response.statusCode).toEqual(200);

        const data = JSON.parse(body);

        expect(data.id).toBeTruthy();
        expect(data.url).toEqual(link.url);
        expect(data.name).toEqual(link.name);
        expect(data.rel).toEqual(link.rel);
      });

      describe('GET', () => {
        let error;
        let response;
        let body;

        beforeEach(async () => {
          await new Promise((resolve) => {
            request(
              `http://localhost:3000/api/v0/users/${userId}/profile/links`,
              (responseError, responseData, responseBody) => {
                error = responseError;
                response = responseData;
                body = responseBody;
                resolve();
              }
            );
          });
        });

        it('returns a collection containing the new link', () => {
          expect(error).toBeFalsy();
          expect(response.statusCode).toEqual(200);

          const data = JSON.parse(body);

          expect(data.forEach).toBeDefined();
          expect(data.length).toEqual(1);
          expect(data[0].id).toBeTruthy();
          expect(data[0].url).toEqual(link.url);
          expect(data[0].name).toEqual(link.name);
          expect(data[0].rel).toEqual(link.rel);
        });
      });
    });
  });

  describe('/profiles', () => {
    beforeEach(async () => {
      const { userId, token } = await signUpAndLogIn('evan2@example.com', 'asdfasdf');
      const username = 'vamptvo';

      await new Promise((resolve) => {
        request.patch({
          url: `http://localhost:3000/api/v0/users/${userId}/profile`,
          auth: {
            bearer: token,
          },
          form: {
            username,
          },
        }, resolve);
      });
    });

    describe('?username=<valid username>', () => {
      let error;
      let response;
      let body;

      beforeEach(async () => {
        await new Promise((resolve) => {
          request(
            'http://localhost:3000/api/v0/profiles?username=vamptvo',
            (responseError, responseData, responseBody) => {
              error = responseError;
              response = responseData;
              body = responseBody;
              resolve();
            },
          );
        });
      });

      it('returns a single item', () => {
        expect(error).toBeFalsy();
        expect(response.statusCode).toEqual(200);

        const data = JSON.parse(body);

        expect(data.length).toEqual(1);
        expect(data[0].username).toEqual('vamptvo');
      });
    });

    describe('?username=<invalid username>', () => {
      let error;
      let response;
      let body;

      beforeEach(async () => {
        await new Promise((resolve) => {
          request(
            'http://localhost:3000/api/v0/profiles?username=evanminto',
            (responseError, responseData, responseBody) => {
              error = responseError;
              response = responseData;
              body = responseBody;
              resolve();
            },
          );
        });
      });

      it('returns an empty items array', () => {
        expect(error).toBeFalsy();
        expect(response.statusCode).toEqual(200);

        const data = JSON.parse(body);

        expect(data.length).toEqual(0);
      });
    });
  });

  describe('/profiles/:id/links', () => {
    describe('GET', () => {
      let error;
      let response;
      let body;

      beforeEach(async () => {
        await await requestFacade.patch({
          url: `http://localhost:3000/api/v0/users/${userId}/profile`,
          auth: {
            bearer: token,
          },
          form: {
            username: 'vamptvo',
          },
        });

        ({ error, response, body } = await requestFacade.get(
          'http://localhost:3000/api/v0/profiles?username=vamptvo',
        ));

        const profileId = JSON.parse(body)[0].id;

        ({ error, response, body } = await requestFacade.get(
          `http://localhost:3000/api/v0/profiles/${profileId}/links`,
        ));
      });

      it('returns links', async () => {
        expect(error).toBeFalsy();
        expect(response.statusCode).toEqual(200);

        const data = JSON.parse(body);

        expect(data.forEach).toBeDefined();
      });
    });
  });
});

async function signUpAndLogIn(email = 'evan@example.com', password = 'asdfasdf') {
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
