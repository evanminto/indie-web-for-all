class ProfilePublisher {
  publish(profile) {
    return {
      username: profile.username,
    };
  }
}

export default new ProfilePublisher();
