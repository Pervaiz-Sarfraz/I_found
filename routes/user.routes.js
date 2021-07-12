const path = require('path');

const express = require('express');

const userController = require('../controllers/user.controller');

const isAuth = require('../middleware/is-auth')


const router = express.Router();

router.get('/', userController.getIndex);

router.get('/lost', isAuth, userController.getLostForm);

router.get('/found',isAuth, userController.getFoundForm);

router.get('/terms', userController.getTerms);


router.get('/privacy', userController.getPrivacy);


router.get('/report-lost', isAuth,  userController.getReportLost);

router.get('/report-found', isAuth, userController.getReportFound);

module.exports = router;
