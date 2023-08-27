const express = require('express');

const router = express.Router();

const usersController = require('../controllers/usersController');
const authMiddleware = require('../config/middleware').auth;

router.post('/signUp', usersController.signUp);
router.post('/signIn', usersController.signIn);
router.get('/test', authMiddleware, function (request, response) {
    console.log('hye')
    response.send('<h1>Hello</h1>');
})

module.exports = router;