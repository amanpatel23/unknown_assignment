const express = require('express');
const cookieParser = require('cookie-parser');

const router = express.Router();

const usersRoute = require('./users');
router.use('/users', usersRoute);
router.get('/get-cookies', function (request, response) {
    const cookie = request.cookies;
    console.log(cookie);
    return response.json({cookie})
})

module.exports = router;