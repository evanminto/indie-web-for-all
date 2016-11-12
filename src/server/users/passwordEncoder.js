import crypto from 'crypto';

class PasswordEncoder {
  generateSalt() {
    return crypto.randomBytes(32);
  }

  generateHash(value, salt) {
    const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */

    hash.update(value);

    return hash.digest('hex');
  }
}

export default new PasswordEncoder();