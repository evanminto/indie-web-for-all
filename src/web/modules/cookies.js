import cookies from 'js-cookies';

class Cookies {
  constructor() {
    this.inBrowser = typeof(window) === 'object';
  }

  getItem(key) {
    if (this.inBrowser) {
      return cookies.getItem(key);
    }
  }

  setItem(key, value, options) {
    if (this.inBrowser) {
      return cookies.setItem(key, value, options);
    }
  }
}

export default new Cookies();
