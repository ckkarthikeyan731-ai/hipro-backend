const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && user.password === password) {
        res.status(200).json({ message: "Login successful", role: user.role });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

module.exports = router;