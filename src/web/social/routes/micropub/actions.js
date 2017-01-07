/**
 * Does nothing for now.
 *
 * @memberOf MicropubActions
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 */
export function createContent(request, response) {
  response.status(204).json({});
}

/**
 * @namespace MicropubActions
 */
export default {};
