const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true,
  scope: ['profile', 'email'],
},

async (req, accessToken, refreshToken, profile, done) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [profile.emails[0].value]);

    if (rows.length > 0) {
      const user = rows[0];
      return done(null, user);
    } else {
      const [result] = await pool.query(
        'INSERT INTO users (username, email, wallet_address) VALUES (?, ?, ?)',
        [profile.displayName, profile.emails[0].value,null]
      );
      const [id] = await pool.query('SELECT max(id) as maxId FROM users');
      const user = {
        id: id[0].maxId,
        username: profile.displayName,
        email: profile.emails[0].value
      };
      return done(null, user);
    }
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
  } catch (err) {
    done(err, null);
  }
});