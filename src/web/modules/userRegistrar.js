import requestFactory from './api/v0/requestFactory';

/**
 * Handles registering new users.
 */
class UserRegistrar {
  /**
   * Takes email and password and creates a new user using the API.
   *
   * @param  {String} email
   * @param  {String} password
   * @return {Promise.<Object>} response from the API call
   */
  async register(email, password) {
    const request = requestFactory.createUser({
      email,
      password,
    });

    const response = await fetch(request);

    if (response.ok) {
      return response.json();
    }

    throw response.json();
  }
}

export default new UserRegistrar();
