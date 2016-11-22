import db from './db';
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

UserAccessToken.belongsTo(User, { as: 'user' });
User.hasMany(UserAccessToken, { as: 'accessTokens' });

Profile.belongsTo(User);
User.hasOne(Profile);

ProfileLink.belongsTo(Profile, { as: 'profile' });
Profile.hasMany(ProfileLink, { as: 'link' });
