import inBrowser from '../../../../src/web/modules/inBrowser';

describe('inBrowser flag', () => {
  it('is true when in a browser', () => {
    expect(inBrowser).toBeTruthy();
  });
});
