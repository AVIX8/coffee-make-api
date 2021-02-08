const User = require('../models/User')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'Lolar',
    algorithms: ['RS256'],
    // issuer: 'accounts.examplesoft.com',
    // audience: 'yoursite.net',
}

function initialize(passport) {
    passport.use(User.createStrategy())
    
    passport.use(
        new JwtStrategy(options, (payload, done) => {
            User.findById(payload.sub)
                .then((user) => {
                    if (user) {
                        return done(null, user)
                    }
                    return done(null, false)
                })
                .catch((err) => done(err, null))
        })
    )

    // passport.serializeUser((user, done) => {
    //     // console.log('serializeUser (user -> user.id)');
    //     done(null, user.id)
    // })

    // passport.deserializeUser(async (userId, done) => {
    //     const user = await User.findById(userId)
    //     // console.log('deserializeUser (user.id -> user)')
    //     done(null, user)
    // })
}

module.exports.initialize = initialize
