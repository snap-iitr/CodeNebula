const router = require('express').Router();
const passport = require('passport');
const { googleCallback, metamaskAuth } = require('../controllers/authController');

router.get('/google', passport.authenticate('google', { scope:['profile','email'], session:false }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect:'/', session:false }), googleCallback);
router.post('/metamask', metamaskAuth);

module.exports = router;
