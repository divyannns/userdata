const express = require('express');  
const mongoose = require('mongoose');  
const bodyParser = require('body-parser');  
const path = require('path');  

const app = express();  
const port = process.env.PORT || 3000;

// Middleware  
 
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 

// MongoDB connection  
mongoose.connect('mongodb://localhost:27017/userDB');  

// User schema  
const userSchema = new mongoose.Schema({  
    firstName: { type: String, required: true },  
    lastName: { type: String, required: true },  
    mobile: { type: String, required: true, match: /^\d{10}$/ }, 
    email: { type: String, required: true, unique: true },   
    address: {  
        street: String,  
        city: String,  
        state: String,  
        country: String,  
    },  
    loginId: { type: String, required: true, unique: true, minlength: 6, maxlength: 8 },  
    password: { type: String, required: true, minlength:6, maxlength:25 },  
    creationTime: { type: Date, default: Date.now },  
    lastUpdated: { type: Date, default: Date.now },  
});  

// User model  
const User = mongoose.model('User', userSchema);  

// API endpoint to save user data  
app.post('/api/users', async (req, res) => {  
    const userData = req.body;  

    try {  
        const user = new User(userData);  
        await user.save();  
        res.status(201).send('User saved successfully!');  
    } catch (error) {  
        res.status(400).send('Error saving user: ' + error.message);  
    }  
});  

// API endpoint to retrieve user data  
app.get('/api/users', async (req, res) => {  
    try {  
        const users = await User.find();  
        res.status(200).json(users);  
    } catch (error) {  
        res.status(500).send('Error retrieving users: ' + error.message);  
    }  
});  

// Start the server  
app.listen(port, () => {  
    console.log(`Server is running on http://localhost:${port}`);  
});