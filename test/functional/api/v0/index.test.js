import request from 'request';
import start from '../../../server';

describe('API v0', () => {
  describe('GET /', () => {
    it('responds successfully', () => {
      return start(true)
        .then((server) => {
          return new Promise((resolve) => {
            request('http://localhost:3000/api/v0', (error, response, body) => {
              expect(error).toBeFalsy();
              expect(response.statusCode).toEqual(200);

              server.close();
              resolve();
            });
          });
        });
    });
  });
});
