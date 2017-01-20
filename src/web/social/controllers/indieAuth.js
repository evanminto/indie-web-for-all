import config from '../../../../config/client';

/**
 * Always accept access tokens on dev/test.
 *
 * @memberOf IndieAuthController
 * @param  {external:Request} request
 * @param  {external:Response} response
 */
export function tokenDev(request, response) {
  response.send(`me=${config.baseUrl}&scope=post`);
}

/**
 * @namespace IndieAuthController
 */
export default {
  tokenDev,
};
