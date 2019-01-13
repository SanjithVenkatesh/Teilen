var session = require('client-sessions');
module.exports = {
    cookieName: 'session',
    secret: 'ooooooooh',
    duration:30000000,
    activeDuration: 50000000,
    secure:true,
};