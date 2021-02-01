const GridFsStorage = require('multer-gridfs-storage')
const { connection } = require('../config/database')

const db = new Promise((resolve, reject) => {
    connection.once('open', () => {
        resolve(connection.db)
    })
    connection.once('error', () => {
        reject()
    })
})

const storage = new GridFsStorage({
    db,
    file: () => {
        return {
            bucketName: 'storage',
        }
    },
})

module.exports.storage = storage
