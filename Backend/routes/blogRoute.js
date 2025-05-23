const express = require('express')
const router = express.Router()
const { createBlog, getBlogs, blogDetails, updateBlog, deleteBlog, getAuthorBlogs, likeBlog, countBlogsByTopic } = require('../controllers/blogController')
const upload = require('../middleware/fileUpload')

router.post('/createblog', upload.array('files'), createBlog)
router.get('/bloglist', getBlogs)
router.get('/blogdetails/:id', blogDetails)
router.put('/updateblog/:id', upload.array('files'), updateBlog)
router.delete('/deleteblog/:id', deleteBlog)
router.get('/blogs/user/:userId', getAuthorBlogs)
router.put('/likeblog/:id', likeBlog)
router.get('/blogs/count/:topicId', countBlogsByTopic);


module.exports = router