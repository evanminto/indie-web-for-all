class UserPublisher {
  publish(user) {
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
