const router = require('express').Router();
const { verifyToken } = require('../middlewares/auth');
const {
  addFriend,
  getFriend,
  searchFriend,
  resultFriendRequests,
} = require('../controllers/friendsController');

router.post('/add-friend', verifyToken, addFriend);
router.post('/search-friends', verifyToken, searchFriend);
router.post('/get-friends', verifyToken, getFriend);
router.post('/request-friend', verifyToken, resultFriendRequests);

module.exports = router;
