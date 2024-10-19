const Post = require('../models/Post');

// @desc    Create post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
    try {
        const post = await Post.create({
            user: req.user.id,
            content: req.body.content,
            image: req.body.image
        });

        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username profilePicture')
            .populate('comments.user', 'username profilePicture')
            .sort('-createdAt');

        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'username profilePicture')
            .populate('comments.user', 'username profilePicture');

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Make sure user owns post
        if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ error: 'Not authorized to update this post' });
        }

        post = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Make sure user owns post
        if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ error: 'Not authorized to delete this post' });
        }

        await post.remove();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if post has already been liked by user
        const liked = post.likes.includes(req.user.id);

        if (liked) {
            // Unlike
            post.likes = post.likes.filter(like => like.toString() !== req.user.id);
        } else {
            // Like
            post.likes.push(req.user.id);
        }

        await post.save();

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};