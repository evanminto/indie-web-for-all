import requestFacade from '../../../requestFacade';
import start from '../../../server';

describe('/micropub', () => {
  let server;

  beforeEach(async () => {
    server = await start(true);
  });

  afterEach(() => {
    server.close();
  });

  describe('POST', () => {
    let error;
    let response;
    let body;

    beforeEach(async () => {
      const result = await requestFacade.post('http://localhost:3000/micropub');

      error = result.error;
      response = result.response;
      body = result.body;
    });

    it('returns a profile', () => {
      expect(error).toBeFalsy();
      expect(response.statusCode).toEqual(204);
    });
  });
});
