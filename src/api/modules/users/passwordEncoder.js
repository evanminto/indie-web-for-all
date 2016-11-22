import crypto from 'crypto';

class PasswordEncoder {
  generateSalt() {
    const secret = crypto.randomBytes(8);
    const source = crypto.randomBytes(32);

    const hash = crypto.createHmac('md5', secret);

    hash.update(source);

    return hash.digest('hex');
  }

  generateHash(value, salt) {
    const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */

    hash.update(value);

    return hash.digest('hex');
  }
}

export default new PasswordEncoder();