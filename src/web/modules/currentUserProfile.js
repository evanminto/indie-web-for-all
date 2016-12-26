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
    })();
  }

  getUsername() {
    return store.state.currentUserProfile.username;
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
