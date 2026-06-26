import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js'; // This now handles everything

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes); // Now serves both jobs and applications

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
    });
}

const PORT = process.env.PORT || 10000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/hipro";

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("⚡ [Database] Connected");
        app.listen(PORT, () => console.log(`🚀 [Server] Active on ${PORT}`));
    })
    .catch(err => console.error("❌ [Database] Connection failure:", err));