const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find or create user to handle registration and login in one flow
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ email, password, role });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({
            message: "Login successful",
            role: user.role,
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;