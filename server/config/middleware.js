const jwt = require('jsonwebtoken');

module.exports.auth = async function(request, response, next) {
    const cookie = request.cookie();
    console.log(cookie);
    next();
}