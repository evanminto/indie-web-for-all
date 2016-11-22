const ModelProxy = require('../../../../src/api/modules/ModelProxy').default;

describe('ModelProxy', () => {
  describe('id', () => {
    it('proxies model value', () => {
      const user = new ModelProxy({
        id: 1234,
      });

      expect(user.id).toEqual(1234);
    });

    it('is undefined if the model has no id', () => {
      const user = new ModelProxy({});

      expect(user.id).not.toBeDefined();
    });
  });

  describe('save()', () => {
    it('proxies model method', () => {
      const save = jest.fn(() => Promise.resolve());
      const user = new ModelProxy({
        save,
      });

      return user.save()
        .then(() => {
          expect(save).toHaveBeenCalled();
        });
    });
  });
});
