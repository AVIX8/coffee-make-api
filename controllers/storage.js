const { connection } = require("../config/database")

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
    connection.db
        .collection('storage.files')
        .findOne({ _id: req.params.id }, (err, file) => {
            if (!file || file.length === 0) {
                return res.status(404).send({
                    message: 'No file exists',
                })
            }

            if (
                file.contentType === 'image/jpeg' ||
                file.contentType === 'image/png'
            ) {
                const downloadStream = req.app.locals.bucket.openDownloadStream(
                    file._id
                )
                downloadStream.pipe(res)
            } else {
                res.status(404).send({
                    err: 'Not an image',
                })
            }
        })
}