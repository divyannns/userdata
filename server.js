const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

const User = require('./models/user'); // Import User model from separate file

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
app.use(express.static(path.join(__dirname, 'public'))); 

// MongoDB connection  
const username = process.env.MONGODB_USERNAME;
// const password = process.env.MONGODB_PASSWORD;

mongoose.connect = ("mongodb+srv://divyanshu903143453:KExgPu2pWfsKj0yT@cluster0.yjmj5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");   

// POST Endpoint to create user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    const errorMessages = {};
    if (error.errors) {
      for (const key in error.errors) {
        errorMessages[key] = error.errors[key].message;
      }
    }
    console.error('Error creating user:', errorMessages);
    res.status(400).send({ message: 'Error creating user', errors: errorMessages });
  }
});

// GET Endpoint to retrieve users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).send({ message: 'Error retrieving users', error });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
