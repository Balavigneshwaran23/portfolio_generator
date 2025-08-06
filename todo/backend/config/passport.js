const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
  // JWT Strategy
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await User.findById(jwt_payload.id).select('-password');
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          console.error('JWT Strategy error:', error);
          return done(error, false);
        }
      }
    )
  );

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('Google Profile:', {
            id: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0]?.value,
            photo: profile.photos[0]?.value
          });

          // Check if user already exists
          let user = await User.findOne({
            $or: [
              { email: profile.emails[0].value },
              { 'googleId': profile.id }
            ]
          });

          if (user) {
            // Update user with Google info if not already set
            if (!user.googleId) {
              user.googleId = profile.id;
            }
            
            // Always update avatar to get the latest profile picture
            // Get high-resolution profile picture
            let avatarUrl = profile.photos[0]?.value;
            if (avatarUrl) {
              // Convert to high-resolution image
              avatarUrl = avatarUrl.replace('s96-c', 's400-c'); // Increase size from 96px to 400px
            }
            user.avatar = avatarUrl;
            user.provider = 'google';
            user.isEmailVerified = true;
            
            await user.save();
            return done(null, user);
          }

          // Get high-resolution profile picture for new users
          let avatarUrl = profile.photos[0]?.value;
          if (avatarUrl) {
            avatarUrl = avatarUrl.replace('s96-c', 's400-c'); // Increase size from 96px to 400px
          }

          // Create new user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: avatarUrl,
            provider: 'google',
            isEmailVerified: true,
          });

          console.log('Created new Google user:', {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
          });

          return done(null, user);
        } catch (error) {
          console.error('Google Strategy error:', error);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-password');
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
