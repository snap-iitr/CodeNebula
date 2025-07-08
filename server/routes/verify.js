const router = require('express').Router();
const { verifyToken, verifyProfile } = require('../controllers/verifyController');

router.post('/verify-token', verifyToken);
router.post('/profile-verify', verifyProfile);

module.exports = router;
