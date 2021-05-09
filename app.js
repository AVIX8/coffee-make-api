const express = require('express')

const dotenv = require('dotenv')

const morgan = require('morgan')
const cors = require('cors')

const mongoose = require('mongoose')
const { connection } = require('./src/config/database')

//Routes
const userRoute = require('./src/routes/user')
const categoryRoute = require('./src/routes/categories')
const productsRoute = require('./src/routes/products')
const storageRoute = require('./src/routes/storage')

const app = express()
dotenv.config()

connection.once('open', () => {
    app.locals.bucket = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: 'storage',
    })
})

app.use(morgan('dev'))

app.use(cors())

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
