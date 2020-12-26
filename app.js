import express from 'express'
import dotenv from 'dotenv'
// import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import connectMongo from 'connect-mongo'
import cors from 'cors'

import connection from './config/database.js'

import passport from 'passport'
import { initialize as initializePassport } from './config/passport.js'

//Routes
import userRoute from './routes/user.js'
import productsRoute from './routes/products.js'

const app = express()
const MongoStore = connectMongo(expressSession);
const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' })
dotenv.config()
// app.use(morgan())

const corsConfig = {
    origin: 'http://83.246.145.119:3000',
    credentials: true,
}
app.use(cors(corsConfig))

const cookieSecret = '748958347thc3g4385ug'

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser(cookieSecret))
app.use(
    expressSession({
        secret: cookieSecret,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 60, // 60d
        },
    })
)

initializePassport(passport)

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    console.log(req.session)
    console.log(`lastmid: ${req.user}`)
    next()
})

// Routes
app.use('/api/user', userRoute)
app.use('/api/products', productsRoute)

app.use('/storage', express.static('./storage'))

const port = process.env.PORT ?? 4000
app.listen(port, () => {
    console.log(`🚀 Serve at http://loacalhost:${port}`)
})
