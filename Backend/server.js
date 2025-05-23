const express = require('express')
const app = express()

require('dotenv').config()

const morgan = require('morgan')
require('./db/connection')
const cors = require('cors')

const bodyParser = require('body-parser')

const port = process.env.PORT || 5000

const blogRoute = require('./routes/blogRoute')
const userRoute = require('./routes/userRoute')
const topicRoute = require('./routes/topicRoute')

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())

app.use('/public/uploads', express.static('public/uploads'))

app.use('/api', blogRoute)
app.use('/api', userRoute)
app.use('/api', topicRoute)

app.listen(port, ()=>{
    console.log(`server started at port ${port}`)
})