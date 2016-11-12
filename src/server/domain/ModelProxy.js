export default class ModelProxy {
  constructor({ model }) {
    this.model = model;
  }

  save() {
    return this.model.save()
      .then(() => this);
  }
}
