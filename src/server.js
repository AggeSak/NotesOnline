const express = require('express');
const cors = require('cors');
const client = require('./db'); // Assuming you have a db.js file to connect to your DB
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { 
    createUser, 
    loginUser, 
    getUsers, 
    createNote, 
    getNotesByUser, 
    deleteNote,
    ModifyNote 
} = require('./controllers/exampleController');  // Ensure correct path


// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Initialize the Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all origins (you can specify your frontend URL here if needed)
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the Notes App API!');
});

app.get('/Panos', (req, res) => {
    res.send('Welcome to the best Notes App API!');
});




// Define routes
app.post('/api/users', createUser);  // Sign Up route
app.post('/api/login', loginUser);   // Login route
app.get('/api/users', getUsers);     // Get users (for testing)
app.post('/api/notes', createNote);  // Create a new note (requires authentication)
app.get('/api/notes', getNotesByUser); // Get notes for logged-in user
app.delete('/api/notes/:id', deleteNote);
app.put('/api/notes/:id', ModifyNote);



// Catch-all route handler

// Start the server
// Inside server.js, update your listen code:
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

