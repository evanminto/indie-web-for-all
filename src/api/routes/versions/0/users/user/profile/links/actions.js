import HttpStatuses from 'http-status-codes';

import db from '../../../../../../../db';
import ApiError from '../../../../../../../modules/errors/ApiError';
import NotFoundError from '../../../../../../../modules/errors/NotFoundError';

export async function getLinks(request, response) {
  try {
    const user = await db.User.findById(request.params.id);

    let profile;

    if (user) {
      profile = await user.getProfile();
    } else {
      throw new NotFoundError('User not found.');
    }

    if (!profile) {
      throw new NotFoundError('Profile not found.');
    }

    const links = await profile.getLinks();

    response.json(links);
  } catch (error) {
    let apiError;

    if (error instanceof NotFoundError) {
      apiError = new ApiError(HttpStatuses.NOT_FOUND, error.message);
    } else {
      apiError = new ApiError(HttpStatuses.INTERNAL_SERVER_ERROR, error);
    }

    response.status(apiError.statusCode)
      .json(apiError.json);
  }
}

export function addLink(request, response) {
  db.sequelize.transaction(async (t) => {
    const user = await db.User.findById(request.params.id);

    let profile;

    if (user) {
      profile = await user.getProfile();
    } else {
      throw new NotFoundError('User not found.');
    }

    if (!profile) {
      throw new NotFoundError('Profile not found.');
    }

    const link = await db.ProfileLink.create({
      url: request.body.url,
      name: request.body.name,
      rel: request.body.rel,
    }, {
      transaction: t,
    });

    await profile.addLink(link, {
      transaction: t,
    });

    response.json({
      id: link.id,
      url: link.url,
      name: link.name,
      rel: link.rel,
    });
  });
}

export function updateLink(request, response) {

}

export default {
  getLinks,
  addLink,
  updateLink,
};
