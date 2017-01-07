/**
 * Collection of methods for performing HTTP content negotiation.
 *
 * @type {Object}
 */
const AcceptHeaderRequirements = {
  /**
   * Express middleware.
   * If the request has an Accept header that accepts ActivityStreams 2.0,
   * continue to the next middleware function. If not, skip this route.
   *
   * @param  {external:Request}   request
   * @param  {external:Response}  response
   * @param  {Function}           next
   */
  activityStreams(request, response, next) {
    const acceptHeader = request.get('Accept');

    if (
      !acceptHeader ||
      acceptHeader.includes('*/*') ||
      acceptHeader.includes('application/ld+json; profile="https://www.w3.org/ns/activitystreams#"') ||
      acceptHeader.includes('application/activity+json')
    ) {
      next();
    } else {
      next('route');
    }
  },
};

export default AcceptHeaderRequirements;
