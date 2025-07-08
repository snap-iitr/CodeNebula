const router = require('express').Router();
const { verifyToken } = require('../middlewares/auth');
const {
  GameData,
  PlayerData,
  PlayerMatchesData,
  LeaderboardData,
} = require('../controllers/dataController');

router.post('/data', verifyToken, GameData);
router.post('/player-data', verifyToken, PlayerData);
router.get('/player-matches-data', PlayerMatchesData);
router.get('/leaderboard-data', verifyToken, LeaderboardData);

module.exports = router;
