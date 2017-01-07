import cookies from 'js-cookies';

import currentSession from './currentSession';
import requestFactory from './api/v0/requestFactory';
import store from '../vue/store';
import { CHANGE_USERNAME, SET_USER_PROFILE_LINKS } from '../vue/store/mutationTypes';

/**
 * A user's public-facing profile.
 */
class Profile {
  /**
   * Get current profile data from the API and initialize the application state.
   *
   * @return {Promise}
   */
  async initialize() {
    const profileRequest = requestFactory.getProfileByUserId(currentSession.userId);
    const linksRequest = requestFactory.getProfileLinks();

    try {
      const profileResponse = await fetch(profileRequest);

      if (profileResponse.ok) {
        const data = await profileResponse.json();
        this.setUsername(data.username);
      } else {
        const data = await profileResponse.json();
        console.error(data);
      }

      const linksResponse = await fetch(linksRequest);

      if (linksResponse.ok) {
        const links = await linksResponse.json();
        this.setLinks(links);
      } else {
        const data = await linksResponse.json();
        console.error(data);
      }

    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Gets the user's username from the application state.
   *
   * @return {String}
   */
  getUsername() {
    return store.state.currentUserProfile.username;
  }

  /**
   * Sets the user's username into the application state.
   *
   * @param {String} newValue
   */
  setUsername(newValue) {
    store.commit(CHANGE_USERNAME, newValue);
  }

  /**
   * Gets the user's profile links from the application state.
   *
   * @return {Object[]}
   */
  getLinks() {
    return store.state.currentUserProfile.links.map((link) => {
      const newLink = Object.assign({}, link);

      // Hardcore rel-me
      newLink.rel = 'me';

      return newLink;
    });
  }

  /**
   * Sets the user's profile links into the application state.
   *
   * @param {Object[]} newValue
   */
  setLinks(links) {
    store.commit(SET_USER_PROFILE_LINKS, links);
  }

  /**
   * Saves the profile using the API.
   *
   * @return {Promise.<Boolean>}
   */
  async save() {
    const updateRequest = requestFactory.updateProfile({
      username: this.getUsername() ? this.getUsername() : '',
    });

    const linkRequests = [];

    this.getLinks().forEach((link) => {
      if (!link.id) {
        linkRequests.push(requestFactory.addProfileLink({
          name: link.name,
          url: link.url,
          rel: link.rel,
        }));
      }
    });

    const responses = await Promise.all(
      [ fetch(updateRequest) ]
        .concat(
          linkRequests.map((request) => {
            return fetch(request);
          })
        )
    );

    for (let response of responses) {
      if (!response.ok) {
        return false;
      }
    }

    return true;
  }
}

export default new Profile();
