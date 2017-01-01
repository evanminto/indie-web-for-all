import db from '../../../../db';

/**
 * Gets all profiles matching the provided filters and returns them in the response.
 *
 * @param  {external:Request}   request
 * @param  {external:Response}  response
 * @return {Promise}
 */
export async function getProfiles(request, response) {
  let profiles = [];

  if (request.query.username) {
    profiles = await db.Profile.findAll({
      where: {
        username: request.query.username,
      },
    });
  }

  if (!profiles) {
    profiles = [];
  }

  response.json(profiles.map((profile) => {
    return {
      username: profile.username,
    }
  }));
};

export default {
  getProfiles,
};
