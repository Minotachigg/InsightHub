const mongoose = require('mongoose');
const Blog = require('../models/blogModel'); // Adjust path to your Blog model
const { ObjectId } = mongoose.Types;
const fs = require('fs');
const path = require('path');

// MongoDB Atlas connection string
const DB_URI = 'mongodb+srv://admin:admin33@cluster0.bdfgfcd.mongodb.net/BlogNest?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

const seedBlogs = async () => {
    try {
        // Replace with actual ObjectIds from your DB
        const userIds = [
            '679237efdf544d3d6d16397b', '679238b9c4d6de08fda4b3b5', '680347353d16156383190fc1', '68034785b8adff5dd2d8dc82', '68034785b8adff5dd2d8dc84', '679705c9c7f660b0156095b7',
            '6797042e20e453c42a8c57db', '68034785b8adff5dd2d8dc86', '68034785b8adff5dd2d8dc7e', '68034785b8adff5dd2d8dc88', '67c029490eae81d98d86a388', '679706e090dca8a36a904c69',
            '68034785b8adff5dd2d8dc7c', '68034785b8adff5dd2d8dc80',
        ];
        const topicIds = [
            '67970833c8ce047f5669f851', '6797081ac8ce047f5669f84b', '67970807c8ce047f5669f848', '679707f1c8ce047f5669f845', '679707ecc8ce047f5669f842', '679707dec8ce047f5669f83f',
            '67970828c8ce047f5669f84e', '679707d9c8ce047f5669f83c', '679707cfc8ce047f5669f839', '679707c7c8ce047f5669f836', '679707c1c8ce047f5669f833',
        ];

        // Get list of files from 'public/uploads' folder
        const uploadDir = path.join(__dirname, '../public/uploads');
        const files = fs.readdirSync(uploadDir);

        const blogs = [];

        for (let i = 0; i < 30; i++) {
            const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
            const randomTopic = topicIds[Math.floor(Math.random() * topicIds.length)];
            const randomViews = Math.floor(Math.random() * (1000 - 100 + 1)) + 100; // Random views between 100 and 999
            const randomLikes = Math.floor(Math.random() * (300 - 10 + 1)) + 10; // Random likes between

            // Get random file from the uploads directory
            const randomFile = files[Math.floor(Math.random() * files.length)];
            const fileUrl = `public/uploads/${randomFile}`;

            // Construct the blog content with separate entries for text and files
            const blogContent = [
                { content_text: `This is some sample content for blog #${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit...` },
                {
                    content_text: `Further content for blog Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        But what if we need to monitor something like user behavior on a website? Imagine running a web store where you sell products. One approach might be to set a minimum threshold for daily sales and check it once a day. But what if something goes wrong, and you need to catch the issue much sooner — within hours or even minutes? In that case, a static threshold won’t cut it because user activity fluctuates throughout the day. This is where anomaly detection comes in.` },
                { files_url: fileUrl }, // File URL entry
            ];

            const blog = new Blog({
                title: `Sample Blog Title ${i + 1}`,
                content: blogContent, // Content field will now contain separate objects for text and file URLs
                topic: new mongoose.Types.ObjectId(randomTopic), // Use 'new mongoose.Types.ObjectId' for ObjectId
                author: new mongoose.Types.ObjectId(randomUser), // Use 'new mongoose.Types.ObjectId' for ObjectId
                views: randomViews,
                claps: randomLikes,
            });

            // Save each blog individually
            await blog.save();
        }

        console.log(`✅ Successfully inserted blogs`);
    } catch (err) {
        console.error('❌ Error inserting blogs:', err);
    } finally {
        mongoose.disconnect();
    }
};

seedBlogs();


