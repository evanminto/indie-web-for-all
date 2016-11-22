import ModelProxy from '../ModelProxy';

class Profile extends ModelProxy {
  get username() {
    return this.model.username;
  }

  set username(value) {
    this.model.username = value;
  }
}

export default Profile;
