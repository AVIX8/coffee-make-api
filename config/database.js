import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connection = mongoose.createConnection(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err) => {
        if (err) {
            console.log('😡 Failed to connect to database')
            console.error(err)
        } else {
            console.log('👏 Conected to db')
        }
    }
)

export default connection
