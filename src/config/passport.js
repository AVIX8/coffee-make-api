const User = require('../models/User')

function initialize(passport) {
    passport.use(User.createStrategy());

    passport.serializeUser((user, done) => {
        // console.log('serializeUser (user -> user.id)');
        done(null, user.id)
    })
    passport.deserializeUser(async (userId, done) => {
        const user = await User.findById(userId)
        // console.log('deserializeUser (user.id -> user)')
        done(null, user)
    })
}



module.exports.initialize = initialize
