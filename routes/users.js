const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
};

// Get user profile
router.get('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('followers', 'username profilePicture')
            .populate('following', 'username profilePicture');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update user profile
router.put('/update', protect, async (req, res) => {
    try {
        const { username, bio, email } = req.body;
        const user = await User.findById(req.user.id);

        if (username) user.username = username;
        if (bio) user.bio = bio;
        if (email) user.email = email;

        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Follow user
router.post('/follow/:id', protect, async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
        }

        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (currentUser.following.includes(req.params.id)) {
            return res.status(400).json({ success: false, message: 'You are already following this user' });
        }

        currentUser.following.push(req.params.id);
        userToFollow.followers.push(req.user.id);

        await currentUser.save();
        await userToFollow.save();

        res.json({ success: true, message: 'Successfully followed user' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Unfollow user
router.post('/unfollow/:id', protect, async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(400).json({ success: false, message: 'You cannot unfollow yourself' });
        }

        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToUnfollow) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!currentUser.following.includes(req.params.id)) {
            return res.status(400).json({ success: false, message: 'You are not following this user' });
        }

        currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user.id);

        await currentUser.save();
        await userToUnfollow.save();

        res.json({ success: true, message: 'Successfully unfollowed user' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;