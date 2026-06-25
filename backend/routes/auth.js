import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email account profile already registered.' });
        }
        const newUser = new User({ name, email, password, role });
        await newUser.save();
        res.status(201).json({ message: 'Registration complete', role: newUser.role });
    } catch (err) {
        res.status(500).json({ message: 'Server registration error.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials provided.' });
        }
        res.status(200).json({ id: user._id, name: user.name, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Server login error.' });
    }
});

export default router;