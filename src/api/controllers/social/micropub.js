import micropub from 'micropub-express';

import config from '../../../../config/client';
import outboxFactory from '../../../api/modules/outboxFactory';

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
    try {
      const outbox = await outboxFactory.createForUsername(request.params.username);

      if (micropubDocument.type.includes('h-entry')) {
        if (
          micropubDocument.properties.content.length &&
          micropubDocument.properties.content[0]
        ) {
          const content = micropubDocument.properties.content[0];

          const note = await outbox.createNote({
            content,
          });

          return {
            url: `${config.baseUrl}/${request.params.username}/notes/${note.id}`,
          };
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

export const createViaMicropub = micropub(micropubConfig);

/**
 * @namespace MicropubController
 */
export default {
  createViaMicropub,
};
