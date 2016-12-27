/**
 * True if the application is running in a browser context.
 *
 * @type {Boolean}
 */
const inBrowser = typeof(window) === 'object';

export default inBrowser;
