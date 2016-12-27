/**
 * Convert [Profiles]{@link Profile} into a representation appropriate for the API.
 */
class ProfilePublisher {
  /**
   * @param  {Profile} profile
   * @return {Object}
   */
  publish(profile) {
    return {
      username: profile.username,
    };
  }
}

export default new ProfilePublisher();
