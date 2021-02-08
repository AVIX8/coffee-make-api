const express = require('express')

const dotenv = require('dotenv')

const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const mongoose = require('mongoose')
const { connection } = require('./src/config/database')

// const expressSession = require('express-session')
// const connectMongo = require('connect-mongo')

const passport = require('passport')
const initializePassport = require('./src/config/passport').initialize

//Routes
const userRoute = require('./src/routes/user')
const categoryRoute = require('./src/routes/categories')
const productsRoute = require('./src/routes/products')
const storageRoute = require('./src/routes/storage')

const app = express()
dotenv.config()

// const MongoStore = connectMongo(expressSession)
// const sessionStore = new MongoStore({
//     mongooseConnection: connection,
//     collection: 'sessions',
// })

connection.once('open', () => {
    app.locals.bucket = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: 'storage',
    })
})

app.use(morgan('dev'))

// const corsConfig = {
//     origin: [
//         'http://83.246.145.119:3000',
//         // 'http://188.133.196.117:3000',
//         'http://localhost:3000/',
//     ],

//     // даунство
//     // origin: (origin, callback) => {
//     //     console.log(origin)
//     //     return callback(null, true)
//     // },
//     // optionsSuccessStatus: 200,
//     //

//     credentials: true,
// }
// app.use(cors(corsConfig))
app.use(cors())

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(
//     expressSession({
//         secret: process.env.COOKIE_SECRET,
//         rolling: true, // force the session identifier cookie to be set on every response
//         resave: true, // forces the session to be saved back to the session store
//         saveUninitialized: false,
//         store: sessionStore,
//         cookie: {
//             maxAge: 1000 * 60 * 60 * 24 * 60, // 60d
//         },
//     })
// )

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
app.use('/api/storage', storageRoute)

// app.use('/storage', express.static('./storage'))

const port = process.env.PORT ?? 4000
app.listen(port, () => {
    console.log(`🚀 Serve at http://loacalhost:${port}`)
})

module.exports = app
