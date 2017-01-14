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


    beforeEach(async () => {
      const { token, userId } = await signUpAndLogIn();
      await setUsername(userId, token, 'vamptvo');

      const result = await requestFacade.post({
        url: 'http://localhost:3000/vamptvo/micropub',
        form: {
          h: 'entry',
          content: 'Lorem Ipsum',
        },
        auth: {
          bearer: 'asdfasdf',
        },
      });

      error = result.error;
      response = result.response;
    });

    it('creates a note', () => {
      expect(error).toBeFalsy();
      expect(response.statusCode).toEqual(201);
    });
  });
});

/**
 * @param  {String} email
 * @param  {String} password
 * @return {Promise.<Object>} token data
 */
async function signUpAndLogIn(email = 'evan@example.com', password = 'asdfasdf') {
  let result;
  let error;
  let response;
  let body;

  result = await requestFacade.post({
    url: 'http://localhost:3000/api/v0/users',
    form: {
      email,
      password,
    },
  });

  error = result.error;
  response = result.response;
  body = result.body;

  expect(error).toBeFalsy();
  expect(response.statusCode).toEqual(201);

  result = await requestFacade.post({
    url: 'http://localhost:3000/api/v0/user_access_tokens',
    auth: {
      password,
      user: email,
    },
  });

  error = result.error;
  response = result.response;
  body = result.body;

  return JSON.parse(body);
}

/**
 * @param {Number} userId
 * @param {String} username
 * @return {Promise.<Object>} profile data
 */
async function setUsername(userId, token, username) {
  const result = await requestFacade.patch({
    url: `http://localhost:3000/api/v0/users/${userId}/profile`,
    auth: {
      bearer: token,
    },
    form: {
      username,
    },
  });

  const error = result.error;
  const response = result.response;
  const body = result.body;

  expect(error).toBeFalsy();
  expect(response.statusCode).toEqual(200);

  return JSON.parse(body);
}
