const router = require('express').Router();
const { setLoading } = require('../controllers/loadingController');
const { verifyToken } = require('../middlewares/auth');


router.post('/', verifyToken, setLoading);

module.exports = router;