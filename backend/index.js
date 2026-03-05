const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RegisterModel = require('./models/register')

const app = express();
app.use(express.json())
app.use(cors())

const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/News-reader";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err.message);
        console.log("💡 Tip: Make sure MongoDB is running! Try starting it in Services or Command Prompt.");
    });

app.post('/register', (req, res) => {
    RegisterModel.create(req.body)
        .then(userdata => res.json(userdata))
        .catch(err => res.json(err))
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    RegisterModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json("Sucess")
                } else {
                    res.json("The password is incorrect")
                }
            } else {
                res.json("Email is not register")
            }
        })
})

app.listen(3001, () => {
    console.log("server is running")
})