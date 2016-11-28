class ProfilePublisher {
  publish(profile) {
    return profile.getLinks()
      .then((links) => {
        return {
          username: profile.username,
          links: links.map((link) => {
            return {
              url: link.url,
              name: link.name,
              rel: link.rel,
            };
          }),
        };
      });
  }
}

export default new ProfilePublisher();
