const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const contentSchema = new mongoose.Schema({
  content_text: {
    type: String
  },
  files_url: {
    type: String
  }
})

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  },
  content: [contentSchema],
  date: {
    type: Date,
    default: Date.now
  },
  topic: {
    type: ObjectId,
    required: true,
    ref: 'Topic'
  },
  author: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },
  views: {
    type: Number,
    default: 0
  },
  claps: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)
