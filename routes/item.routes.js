const path = require('path');

const express = require('express');

const itemController = require('../controllers/item.controller');

const isAuth = require('../middleware/is-auth')

const router = express.Router();


router.post('/item', isAuth, itemController.postItem);

router.get('/lost-items', itemController.getLostPage);

router.get('/found-items', itemController.getFoundPage);

module.exports = router;
