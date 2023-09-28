const router = require('express').Router();
const mainController = require('./controllers/mainController');

router.get('/' , mainController.homePage);

module.exports = router;