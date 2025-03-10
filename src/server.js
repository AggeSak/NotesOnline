const express = require('express');
const cors = require('cors');
const client = require('./db'); // Assuming you have a db.js file to connect to your DB
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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




// Create a new user (Sign Up)
const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before saving to the DB
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await client.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );

        // Generate a JWT token
        const token = jwt.sign({ userId: result.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: result.rows[0] });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare password with hashed password in DB
        const isPasswordValid = await bcrypt.compare(password, result.rows[0].password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: result.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user: result.rows[0] });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: 'Failed to log in user' });
    }
};

// Get all users (For debugging/testing purposes)
const getUsers = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Create a new note (only accessible if user is authenticated)
const createNote = async (req, res) => {
    const { title, content } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authorization required' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const result = await client.query(
            'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [userId, title, content]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating note:', err);
        res.status(500).json({ error: 'Failed to create note' });
    }
};

// Get all notes for the logged-in user
const getNotesByUser = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authorization required' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const result = await client.query('SELECT * FROM notes WHERE user_id = $1', [userId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
};

// Define routes
app.post('/api/users', createUser);  // Sign Up route
app.post('/api/login', loginUser);   // Login route
app.get('/api/users', getUsers);     // Get users (for testing)
app.post('/api/notes', createNote);  // Create a new note (requires authentication)
app.get('/api/notes', getNotesByUser); // Get notes for logged-in user
app.delete('/api/notes/:id',deleteNote);

// Start the server
// Inside server.js, update your listen code:
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

