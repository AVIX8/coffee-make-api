const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const cors = require('cors')

const connection = require('./config/database')
const passport = require('passport')
const initializePassport = require('./config/passport').initialize

//Routes
const userRoute = require('./routes/user')
const categoryRoute = require('./routes/categories')
const productsRoute = require('./routes/products')

const app = express()
const MongoStore = connectMongo(expressSession)
const sessionStore = new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions',
})
dotenv.config()
app.use(morgan('dev'))

const corsConfig = {
    origin: 'http://83.246.145.119:3000',
    credentials: true,
}
app.use(cors(corsConfig))

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
    expressSession({
        secret: process.env.COOKIE_SECRET,
        rolling: true, // force the session identifier cookie to be set on every response
        resave: true, // forces the session to be saved back to the session store
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 60, // 60d
        },
    })
)

initializePassport(passport)

app.use(passport.initialize())
app.use(passport.session())

// app.use((req, res, next) => {
//     console.log('======== Session & User ========')
//     console.log(req.session)
//     console.log(`User: ${req.user}`)
//     console.log('======== Session & User ========')
//     next()
// })

// Routes
app.use('/api/user', userRoute)
app.use('/api/categories', categoryRoute)
app.use('/api/products', productsRoute)

app.use('/storage', express.static('./storage'))

const port = process.env.PORT ?? 4000
app.listen(port, () => {
    console.log(`🚀 Serve at http://loacalhost:${port}`)
})

module.exports = app
