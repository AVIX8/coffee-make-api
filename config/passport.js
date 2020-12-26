import { Strategy as LocalStrategy } from 'passport-local'
// import { StrategyCreated } from "passport";
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

function initialize(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email', passReqToCallback : true  }, authenticateUser)
    )

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

function authenticateUser(email, password, done) {
    console.log(`authenticateUser: ${email}, ${password}`)
    User.findOne({ email: email }, (err, user) => {
        if (err) return done(err)
        if (!user) return done(null, false, { msg: 'Неверная почта' })
        console.log(`authenticateUser ${user}`)
        bcrypt
            .compare(password, user.hash)
            .then((data) => {
                if (data) return done(null, user)
                else return done(null, false, { msg: 'Неверный пароль' })
            })
            .catch(() =>
                done(null, false, { msg: 'На сервере произошла ошибка' })
            )
    })
}

export { initialize }
