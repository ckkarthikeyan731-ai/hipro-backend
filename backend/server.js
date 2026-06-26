import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import our integrated application routes
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve filenames and paths cleanly for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global Middleware Configs
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

// Serve uploaded document attachments statically from disk storage
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve your pre-compiled frontend asset files statically
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Explicit API Route Mappings
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Fallback Route: Direct all global web browser traffic to the single-page application entry point
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Connect to MongoDB Atlas and initialize the global cluster listen block
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
    .then(() => {
        console.log("Database Connection Verified & Mounted Status: Active");
        app.listen(PORT, () => {
            console.log(`HiPro Global Production Engine active on routing port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Critical Database initialization failure:", err);
    });