import Activity from './models/Activity';
import ActivityObject from './models/ActivityObject';
import Actor from './models/Actor';
import Note from './models/Note';
import Profile from './models/Profile';
import ProfileLink from './models/ProfileLink';
import User from './models/User';
import UserAccount from './models/UserAccount';
import UserAccessToken from './models/UserAccessToken';
import UserCredentials from './models/UserCredentials';

UserAccount.belongsTo(User, { as: 'user' });
User.hasOne(UserAccount, { as: 'account' });

UserCredentials.belongsTo(UserAccount, {
  as: 'account',
  foreignKey: 'account_id',
});

UserAccount.hasOne(UserCredentials, {
  as: 'credentials',
  foreignKey: 'account_id',
});

// Users
User.hasMany(UserAccessToken, { as: 'accessTokens' });
UserAccessToken.belongsTo(User, { as: 'user' });

User.hasOne(Profile);
Profile.belongsTo(User);

// Profiles
Profile.hasMany(ProfileLink, { as: 'links' });
ProfileLink.belongsTo(Profile, { as: 'profile' });

// Actors
Actor.hasOne(Profile, { as: 'profile' });
Profile.belongsTo(Actor, { as: 'actor' });

Actor.hasMany(Activity, { as: 'activities' });
Activity.belongsTo(Actor, { as: 'actor' });

Actor.hasMany(Note, { as: 'notes' });
Note.belongsTo(Actor, { as: 'actor' });

// Activity Objects
ActivityObject.hasMany(Activity, {
  as: 'activities',
  foreignKey: 'object_id',
});

Activity.belongsTo(ActivityObject, {
  as: 'object',
  foreignKey: 'object_id',
});

ActivityObject.hasOne(Note, {
  as: 'note',
  foreignKey: 'object_id',
});

Note.belongsTo(ActivityObject, {
  as: 'object',
  foreignKey: 'object_id',
});
