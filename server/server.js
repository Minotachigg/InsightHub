const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()

const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

require('./db/connection')

// ROUTES
const blogRoute = require('./routes/blogRoute')
const userRoute = require('./routes/userRoute')
const topicRoute = require('./routes/topicRoute')
const imageRoute = require('./routes/imageRoute')

const port = process.env.PORT || 8000

// =========================
// MIDDLEWARES
// =========================
app.use(morgan('dev'))
app.use(bodyParser.json())

// CORS CONFIG (FIXED)
const allowedOrigins = [
  "http://localhost:3000",
  "https://insighthub-1-hfwb.onrender.com"
]

app.use(cors({
  origin: function (origin, callback) {
    // allow Postman / server-to-server
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    // block unknown origins safely (no crash)
    return callback(null, false)
  },
  credentials: true
}))

// STATIC FILES
app.use('/public/uploads', express.static('public/uploads'))

// =========================
// ROUTES
// =========================
app.use('/api', blogRoute)
app.use('/api', userRoute)
app.use('/api', topicRoute)
app.use('/api', imageRoute)

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("InsightHub API is running 🚀")
})

// =========================
// START SERVER
// =========================
app.listen(port, () => {
  console.log(`server started at port ${port}`)
})