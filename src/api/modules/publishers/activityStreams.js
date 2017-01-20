import config from '../../../../config/client';

/**
 * Publishes entities as ActivityStreams 2.0 objects.
 */
class ActivityStreamsPublisher {
  /**
   * @param  {Profile} profile
   * @return {Object}
   */
  publishProfile(profile) {
    return Object.assign({}, getBaseObject(), {
      type: 'Person',
      id: `${config.baseUrl}/${profile.username}`,
      name: profile.username,
      outbox: `${config.baseUrl}/${profile.username}/outbox`,
    });
  }
}

/**
 * @return {Object} base ActivityStreams 2.0 object, used to construct other ones
 */
function getBaseObject() {
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
  };
}

export default new ActivityStreamsPublisher();
