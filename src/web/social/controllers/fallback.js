/**
 * Handles requests that don't match any explicit routes.
 *
 * @memberOf FallbackController
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 * @param  {Function}           next
 */
export function fallback(request, response, next) {
  const acceptHeader = request.get('Accept');

  if (
    !acceptHeader ||
    acceptHeader.includes('application/ld+json; profile="https://www.w3.org/ns/activitystreams#"') ||
    acceptHeader.includes('application/activity+json')
  ) {
    response
      .status(404)
      .json({
        message: 'Route not found.',
      });
  } else {
    next();
  }
}

/**
 * Actions for use at the top level of the Social API.
 *
 * @namespace FallbackController
 */
export default {
  fallback,
};
