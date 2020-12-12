const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')

//Routes
const userRoute = require('./routes/user')
const productsRoute = require('./routes/products')

dotenv.config()

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('Conected to db')
    }
)

app.use(morgan('dev'))

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(express.json())
app.use('/api/user', userRoute)
app.use('/api/products', productsRoute)

app.listen(4000, () => {
    console.log('Server up is running')
})
