import User from '../models/User.js'

function initialize(passport) {
    passport.use(User.createStrategy());

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (userId, done) => {
        const user = await User.findById(userId)
        console.log(`deserializeUser ${user}`)
        if (user) {
        } else {
            console.log('')
        }
        done(null, user)
    })
}

export { initialize }
