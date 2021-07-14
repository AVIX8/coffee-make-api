const { connection } = require('../config/database')
const mongoose = require('mongoose')

module.exports.get = (req, res) => {
    connection.db
        .collection('storage.files')
        .find()
        .toArray((err, files) => {
            // Check if files
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: 'No files exist',
                })
            }

            // Files exist
            return res.json(files)
        })
}

module.exports.getImageById = (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send()
    }
    let _id = mongoose.Types.ObjectId(req.params.id)
    connection.db.collection('storage.files').findOne({ _id }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).send({
                message: 'No file exists',
            })
        }

        if (
            file.contentType === 'image/jpg' ||
            file.contentType === 'image/jpeg' ||
            file.contentType === 'image/png' ||
            file.contentType === 'image/gif'
        ) {
            const downloadStream = req.app.locals.bucket.openDownloadStream(_id)
            downloadStream.pipe(res)
        } else {
            console.log(file.contentType)
            return res.status(404).send({
                err: 'Not an image',
            })

        }
    })
}
