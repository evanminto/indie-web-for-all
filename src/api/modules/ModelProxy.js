/**
 * @external Model
 * @see http://sequelize.readthedocs.io/en/latest/api/model/
 */

export default class ModelProxy {
  /**
   * @param  {external:Model} model
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * @type {Number}
   * @readOnly
   */
  get id() {
    return this.model.id;
  }

  /**
   * @param  {...*} args
   * @return {Promise.<ModelProxy>} the current instance
   */
  async save(...args) {
    await this.model.save(...args);

    return this;
  }
}
