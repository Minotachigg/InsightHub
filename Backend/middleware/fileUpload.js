const multer = require('multer')
const path = require('path')
const fs = require('fs') // fs = file system

// storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileDestination = 'public/uploads'
        // check if the directory exits or not
        if (!fs.existsSync(fileDestination)) {
            // make folder
            fs.mkdirSync(fileDestination, { recursive: true })
        }
        cb(null, fileDestination)
    },
    filename: (req, file, cb) => {
        // 'img/folder/abc.jpg' returns -> abc only
        let filename = path.basename(file.originalname, path.extname(file.originalname))
        // .jpg
        let ext = path.extname(file.originalname)
        // generating unique name for file
        cb(null, filename + '_' + Date.now() + ext)
    }
})

// to upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max size
    fileFilter: (req, file, cb) => {
        // check if the file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed!'))
        }
    }

})

module.exports = upload