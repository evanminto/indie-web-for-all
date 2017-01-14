import express from 'express';
import micropub from 'micropub-express';

import config from '../../../../../../config/client';
import apiClient from '../../../../modules/api/v0/client';

const router = express.Router({
  mergeParams: true,
});

const micropubConfig = {
  /**
   * @param  {external:Request} request
   * @return {Object} keys: me, endpoint
   */
  tokenReference(request) {
    let meUrl = `${config.baseUrl}/${request.params.username}`;

    // In dev/test, don't ACTUALLY verify the user's identity.
    if (process.env.NODE_ENV !== 'production') {
      meUrl = config.baseUrl;
    }

    return {
      me: meUrl,
      endpoint: config.micropub.tokenEndpoint,
    };
  },

  /**
   * @param  {Object} micropubDocument
   * @param  {external:Request} request
   * @return {Promise.<Object>} key: url
   */
  async handler(micropubDocument, request) {
    const profile = await apiClient.getProfileByUsername(request.params.username);

    try {
      if (profile) {
        if (micropubDocument.type.includes('h-entry')) {
          if (
            micropubDocument.properties.content.length &&
            micropubDocument.properties.content[0]
          ) {
            const content = micropubDocument.properties.content[0];

            const note = await apiClient.createNote(profile.id, {
              content,
            });

            const url = `${config.baseUrl}/${request.params.username}/notes/${note.id}`;

            return { url };
          }
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log(error);
      }

      return false;
    }

    return false;
  },
};

router.use('/', micropub(micropubConfig));

export default router;
