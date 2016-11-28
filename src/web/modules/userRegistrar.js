import requestFactory from './api/v0/requestFactory';

class UserRegistrar {
  register(email, password) {
    const request = requestFactory.createUser({
      email,
      password,
    });

    return fetch(request)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw response.json();
      });
  }
}

export default new UserRegistrar();
