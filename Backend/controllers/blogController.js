const Blog = require('../models/blogModel')
const parseContent = require('../utils/parseContent')

// CREATE BLOG
exports.createBlog = async (req, res) => {
    try {
        const { title, topic, author } = req.body
        const contentData = JSON.parse(req.body.content_data)
        const content = parseContent(contentData, req.files)

        const blog = await Blog.create({ title, content, topic, author })

        if (!blog) {
            return res.status(400).json({ error: 'Something went wrong' })
        }
        res.status(201).json(blog)

    } catch (err) {
        console.error('Create blog error:', err.message, err.stack);
    }
}

// GET ALL
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .sort({ date: -1 })
            .populate('author', 'name')
            .populate('topic', 'topic_name');

        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching blogs' });
    }
};


// GET ONE
exports.blogDetails = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name')
            .populate('topic', 'topic_name')

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' })
        }

        // Increment the view count
        blog.views += 1
        await blog.save()

        res.json(blog)
    } catch (err) {
        res.status(500).json({ error: 'Error fetching blog details' })
    }
}

// UPDATE
exports.updateBlog = async (req, res) => {
    try {
        const { title, topic } = req.body
        const contentData = JSON.parse(req.body.content_data)
        const content = parseContent(contentData, req.files)

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, content, topic, date: new Date() },
            { new: true }
        )

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' })
        }
        res.json(blog)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error updating blog' })
    }
}

// DELETE
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id)
        if (!blog) return res.status(404).json({ error: 'Blog not found' })
        res.json({ message: 'Blog deleted successfully' })
    } catch (err) {
        res.status(500).json({ error: 'Error deleting blog' })
    }
}

// GET BLOGS BY AUTHOR
exports.getAuthorBlogs = async (req, res) => {
    try {
        console.log("User ID:", req.params.userId)
        const blogs = await Blog.find({ author: req.params.userId })
            .sort({ date: -1 });

        if (!blogs.length) {
            return res.status(404).json({ message: 'No blogs found for this user' });
        }

        res.json(blogs);
    } catch (err) {
        console.error(err); // Log the error if any
        res.status(500).json({ error: 'Error fetching user blogs' });
    }
};

// LIKE BLOG
exports.likeBlog = async (req, res) => {
    try {
        // Check if the blog ID is valid
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Increment the likes count
        blog.likes += 1;

        await blog.save();

        res.json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error liking the blog' });
    }
};

// GET COUNT OF BLOGS BY TOPIC
exports.countBlogsByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;

        const count = await Blog.countDocuments({ topic: topicId });

        res.json({ count });
    } catch (err) {
        console.error('Error getting blog count:', err);
        res.status(500).json({ error: 'Failed to count blogs' });
    }
};
