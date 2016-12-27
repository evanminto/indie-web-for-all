import crypto from 'crypto';

/**
 * Encodes passwords and other sensitive information.
 */
class PasswordEncoder {
  /**
   * Generates a random salt value.
   *
   * @return {String}
   */
  generateSalt() {
    const secret = crypto.randomBytes(8);
    const source = crypto.randomBytes(32);

    const hash = crypto.createHmac('md5', secret);

    hash.update(source);

    return hash.digest('hex');
  }

  /**
   * Generates a hashed value based on the provided value and hash.
   *
   * @param  {String} value
   * @param  {String} salt
   * @return {String}
   */
  generateHash(value, salt) {
    const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */

    hash.update(value);

    return hash.digest('hex');
  }
}

export default new PasswordEncoder();