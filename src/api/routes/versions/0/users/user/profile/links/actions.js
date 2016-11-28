import HttpStatuses from 'http-status-codes';

import db from '../../../../../../../db';
import NotFoundError from '../../../../../../../modules/errors/NotFoundError';

export function getLinks(request, response) {
  db.Profile.findOne({
    where: {
      user_id: request.params.id,
    },
    include: [db.ProfileLink],
  })
    .then((profile) => {
      response.json(profile.links);
    });
}

export function addLink(request, response) {
  let currentUser;
  let currentProfile;
  let newLink;

  db.sequelize.transaction((t) => {
    return db.User.findById(request.params.id)
      .then((user) => {
        if (user) {
          currentUser = user;
          return user.getProfile();
        } else {
          throw new NotFoundError('User not found.');
        }
      })
      .then((profile) => {
        if (profile) {
          return profile;
        } else {
          return currentUser.createProfile({}, {
            transaction: t,
          });
        }
      })
      .then((profile) => {
        currentProfile = profile;

        return profile;
      })
      .then(() => {
        return db.ProfileLink.create({
          url: request.body.url,
          name: request.body.name,
          rel: request.body.rel,
        }, {
          transaction: t,
        });
      })
      .then((link) => {
        newLink = link;

        return currentProfile.addLink(link, {
          transaction: t,
        });
      })
      .then(() => {
        response.json({
          id: newLink.id,
          url: newLink.url,
          name: newLink.name,
          rel: newLink.rel,
        });
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
