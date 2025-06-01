const mongoose = require('mongoose')
const Blog = require('../models/blogModel') // Adjust the path to your Blog model

const deleteAllBlogs = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://admin:admin33@cluster0.bdfgfcd.mongodb.net/BlogNest?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        // Delete all blogs from the 'blogs' collection
        const result = await Blog.deleteMany({})
        console.log(`${result.deletedCount} blogs deleted.`)
    } catch (err) {
        console.error('Error deleting blogs:', err)
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect()
    }
}

// Call the delete function
deleteAllBlogs()
