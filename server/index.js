require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RegisterModel = require('./models/register');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Database Connection
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/News-reader";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err.message);
        console.log("💡 Tip: Make sure MongoDB is running! Try starting it in Services or Command Prompt.");
    });

// API Routes
app.get('/api/test', (req, res) => {
    res.status(200).json({ 
        status: "success", 
        message: "Backend is fully operational",
        timestamp: new Date().toISOString()
    });
});

app.post('/api/register', async (req, res) => {
    try {
        const userdata = await RegisterModel.create(req.body);
        res.status(201).json({ status: "success", data: userdata });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await RegisterModel.findOne({ email });
        if (user) {
            if (user.password === password) {
                res.status(200).json({ status: "success", message: "Login successful" });
            } else {
                res.status(401).json({ status: "error", message: "Incorrect password" });
            }
        } else {
            res.status(404).json({ status: "error", message: "Email not registered" });
        }
    } catch (err) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

// News Proxy Route (Fixes 426 Error on Vercel/Production)
app.get('/api/news', async (req, res) => {
    const { q, language, pageSize } = req.query;
    const API_KEY = process.env.NEWS_API_KEY || 'da7a14e2c2c243b2b921a0a11d732b05';
    
    try {
        const axios = require('axios');
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q,
                language: language || 'en',
                pageSize: pageSize || 30,
                sortBy: 'publishedAt',
                apiKey: API_KEY
            },
            headers: {
                'User-Agent': 'EmoNews-App'
            }
        });
        res.status(200).json(response.data);
    } catch (err) {
        console.error("News Proxy Error:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({
            status: "error",
            message: err.response?.data?.message || "Failed to fetch news"
        });
    }
});

// Start Server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 EmoNews Server running on http://localhost:${PORT}`);
        console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

module.exports = app;