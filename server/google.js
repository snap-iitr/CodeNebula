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
    const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [profile.id]);

    if (rows.length > 0) {
      const user = rows[0];
      return done(null, user);
    } else {
      const [result] = await pool.query(
        'INSERT INTO users (google_id, name, email, address) VALUES (?, ?, ?, ?)',
        [profile.id, profile.displayName, profile.emails[0].value,null]
      );
      const user = {
        id: result.insertId,
        google_id: profile.id,
        display_name: profile.displayName,
        email: profile.emails[0].value
      };
      return done(null, user);
    }
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.google_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [id]);
    done(null, rows[0]);
  } catch (err) {
    done(err, null);
  }
});