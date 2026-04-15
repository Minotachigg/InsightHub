const express = require('express')
const router = express.Router()
const upload = require('../middleware/fileUpload') 

// POST /upload-image 
// This route handles image uploads from the HTML content editor
router.post('/uploadImage', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' })
    }
    // Construct a public URL for the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`

    res.json({ url: imageUrl })
})

module.exports = router
