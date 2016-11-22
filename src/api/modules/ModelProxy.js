export default class ModelProxy {
  constructor(model) {
    this.model = model;
  }

  get id() {
    return this.model.id;
  }

  save(...args) {
    return this.model.save(...args)
      .then(() => this);
  }
}
