import requestFactory from './api/v0/requestFactory';

class UserRegistrar {
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
