import cookies from 'js-cookies';

import requestFactory from './api/v0/requestFactory';
import store from '../vue/store';
import { CHANGE_USERNAME, SET_USER_PROFILE_LINKS } from '../vue/store/mutationTypes';

class Profile {
  initialize() {
    const profileRequest = requestFactory.getProfile();
    const linksRequest = requestFactory.getProfileLinks();

    (async () => {
      try {
        const profileResponse = await fetch(profileRequest);

        if (profileResponse.ok) {
          const data = await profileResponse.json();
          store.commit(CHANGE_USERNAME, data.username);
        } else {
          const data = await profileResponse.json();
          console.error(data);
        }

        const linksResponse = await fetch(linksRequest);

        if (linksResponse.ok) {
          const links = await linksResponse.json();
          store.commit(SET_USER_PROFILE_LINKS, links);
        } else {
          const data = await linksResponse.json();
          console.error(data);
        }

      } catch (error) {
        console.error(error);
      }
    })();
  }

  getUsername() {
    return store.state.currentUserProfile.username;
  }

  setUsername(newValue) {
    store.commit(CHANGE_USERNAME, newValue);
  }

  setUsername(newValue) {
    store.commit(CHANGE_USERNAME, newValue);
  }

  getLinks() {
    return store.state.currentUserProfile.links;
  }

  setLinks(links) {
    store.commit(SET_USER_PROFILE_LINKS, links);
  }
}

export default new Profile();
