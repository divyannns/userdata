const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/webservice',);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define User Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobileNo: { type: String, required: true, match: /^[0-9]{10}$/ },
    emailId: { type: String, required: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ },
    address: {
        street: String,
        city: String,
        state: String,
        country: String
    },
    loginId: { type: String, required: true, match: /^[a-zA-Z0-9]{8,}$/ },
    password: {
        type: String,
        validate: {
            validator: function(v) {
                return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(v);
            },
            message: 'Password must contain at least one lowercase letter, one uppercase letter, and one special character'
        },
        minlength: [6, 'Password must be at least 6 characters'],
        required: [true, 'Password is required']
    },
    creationTime: { type: Date, default: Date.now },
    lastUpdatedOn: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// API Routes
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});