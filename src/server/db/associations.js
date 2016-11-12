import db from './db';
import Profile from './models/Profile';
import ProfileLink from './models/ProfileLink';
import User from './models/User';
import UserAccount from './models/UserAccount';
import UserCredentials from './models/UserCredentials';

UserAccount.belongsTo(User, { as: 'user' });
User.hasOne(UserAccount, { as: 'account' });

UserCredentials.belongsTo(UserAccount, { as: 'account' });
UserAccount.hasOne(UserCredentials, { as: 'credentials' });

Profile.belongsTo(User);
User.hasOne(Profile);

ProfileLink.belongsTo(Profile, { as: 'profile' });
Profile.hasMany(ProfileLink, { as: 'link' });
