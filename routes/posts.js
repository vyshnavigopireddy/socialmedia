const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Assuming you have a Post model

// Create a new post
router.post('/', async (req, res) => {
    try {
        const { userId, content } = req.body;

        // Create new post
        const newPost = new Post({
            userId,
            content,
        });

        const savedPost = await newPost.save();
        res.status(201).json({ success: true, post: savedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'username');
        res.json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('userId', 'username');
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update a post
router.put('/:id', async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        post.content = content || post.content;

        const updatedPost = await post.save();
        res.json({ success: true, post: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        await post.remove();
        res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
