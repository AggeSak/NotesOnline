const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const routes = require('./routes');
const client = require('./db'); // Assuming this is where the DB connection is handled
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
    origin: 'https://notesonline-1.onrender.com', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
