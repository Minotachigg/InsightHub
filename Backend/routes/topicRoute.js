const express = require('express')
const { postTopic, topicList, topicDetails, updateTopic, deleteTopic } = require('../controllers/topicController')
const router = express.Router()

router.post('/posttopic', postTopic)
router.get('/topiclist', topicList)
router.get('/topicdetails/:id', topicDetails)
router.put('/updatetopic/:id', updateTopic)
router.delete('/deletetopic/:id', deleteTopic)

module.exports = router