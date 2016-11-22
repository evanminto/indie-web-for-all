class UserPublisher {
  publish(user, { accessToken = false } = {}) {
    return user.getAccount()
      .then((account) => {
        return {
          id: user.id,
          email: account.email,
        };
      });
  }
}

export default new UserPublisher();
