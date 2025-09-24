import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import UserModel from '../models/user.model.js';

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/user/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let existingUser = await UserModel.findOne({
            $or: [
                { googleId: profile.id },
                { email: profile.emails[0].value }
            ]
        });

        if (existingUser) {
            // Update Google ID if user exists but doesn't have it
            if (!existingUser.googleId) {
                existingUser.googleId = profile.id;
                await existingUser.save();
            }
            return done(null, existingUser);
        }

        // Create new user
        const newUser = await UserModel.create({
            googleId: profile.id,
            name: profile.displayName || profile.name?.givenName + ' ' + profile.name?.familyName,
            email: profile.emails[0].value,
            avatar: {
                publicId: profile.id,
                secureUrl: profile.photos[0]?.value || `https://res.cloudinary.com/dnknslaku/image/upload/v1753346861/lms/gcjaot4wf4z9q1hmx4mx.jpg`
            },
            role: 'user',
            authProvider: 'google',
            isVerified: true // Google accounts are pre-verified
        });

        done(null, newUser);
    } catch (error) {
        done(error, null);
    }
}));

// GitHub OAuth Strategy  
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/v1/user/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let existingUser = await UserModel.findOne({
            $or: [
                { githubId: profile.id },
                { email: profile.emails?.[0]?.value }
            ]
        });

        if (existingUser) {
            // Update GitHub ID if user exists but doesn't have it
            if (!existingUser.githubId) {
                existingUser.githubId = profile.id;
                await existingUser.save();
            }
            return done(null, existingUser);
        }

        // Create new user
        const newUser = await UserModel.create({
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || `${profile.username}@github.local`,
            avatar: {
                publicId: profile.id,
                secureUrl: profile.photos[0]?.value || `https://res.cloudinary.com/dnknslaku/image/upload/v1753346861/lms/gcjaot4wf4z9q1hmx4mx.jpg`
            },
            role: 'user',
            authProvider: 'github',
            isVerified: true // GitHub accounts are pre-verified
        });

        done(null, newUser);
    } catch (error) {
        done(error, null);
    }
}));

export default passport;