/**
 * Convert [Users]{@link User} into a representation appropriate for the API.
 */
class UserPublisher {
  /**
   * @param  {User}     user
   * @param  {Object}   [options]
   * @param  {Boolean}  [options.accessToken=false] does nothing
   * @return {Object}
   */
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
