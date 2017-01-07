import request from 'request';

/**
 * Wraps the request module in a Promise to enable easier test-writing.
 */
class RequestFacade {
  /**
   * @param  {String|Object} url
   * @return {Promise.<Object>}   keys: error, response, body
   */
  async get(url) {
    return callRequestMethod(request.get, url);
  }

  /**
   * @param  {String|Object} url
   * @return {Promise.<Object>}   keys: error, response, body
   */
  async post(url) {
    return callRequestMethod(request.post, url);
  }

  /**
   * @param  {String|Object} url
   * @return {Promise.<Object>}   keys: error, response, body
   */
  async patch(url) {
    return callRequestMethod(request.patch, url);
  }

  /**
   * @param  {String|Object} url
   * @return {Promise.<Object>}   keys: error, response, body
   */
  async delete(url) {
    return callRequestMethod(request.delete, url);
  }
}

/**
 * Calls the specified method on the request object with the specified URL/config object.
 *
 * @param  {Function}      method
 * @param  {String|Object} url
 * @return {Promise.<Object>} keys: error, response, body
 * @private
 */
function callRequestMethod(method, url) {
  return new Promise((resolve) => {
    method.call(
      request,
      url,
      (error, response, body) => {
        resolve({
          error,
          response,
          body,
        });
      },
    );
  });
}

export default new RequestFacade();
