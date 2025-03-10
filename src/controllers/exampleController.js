const client = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Example route handler
const getExample = (req, res) => {
    res.json({ message: 'This is an example response' });
};

// Test database connection
const testDatabase = async (req, res) => {
    try {
        const result = await client.query('SELECT NOW() AS current_time');
        res.json({ message: 'Database connection successful', time: result.rows[0].current_time });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ error: 'Failed to connect to the database' });
    }
};

// Create a new user (Sign Up)
const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await client.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({ user, token });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Failed to login' });
    }
};

// Middleware to verify JWT
const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Create a new note (Authenticated)
const createNote = async (req, res) => {
    const { title, content } = req.body;
    const user_id = req.userId; // From authenticateUser middleware

    try {
        const result = await client.query(
            'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [user_id, title, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating note:', err);
        res.status(500).json({ error: 'Failed to create note' });
    }
};

// Get all notes for logged-in user
const getNotesByUser = async (req, res) => {
    const user_id = req.userId; // From authenticateUser middleware

    try {
        const result = await client.query('SELECT * FROM notes WHERE user_id = $1', [user_id]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
};

// Edit a note (Authenticated)
const editNote = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const user_id = req.userId; // Ensure user owns the note

    try {
        const note = await client.query('SELECT * FROM notes WHERE id = $1 AND user_id = $2', [id, user_id]);

        if (note.rows.length === 0) {
            return res.status(404).json({ error: 'Note not found or unauthorized' });
        }

        const result = await client.query(
            'UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *',
            [title, content, id]
        );

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating note:', err);
        res.status(500).json({ error: 'Failed to update note' });
    }
};

// Delete a note (Authenticated)
const deleteNote = async (req, res) => {
    const { id } = req.params;
    const user_id = req.userId; // Ensure user owns the note

    try {
        const note = await client.query('SELECT * FROM notes WHERE id = $1 AND user_id = $2', [id, user_id]);

        if (note.rows.length === 0) {
            return res.status(404).json({ error: 'Note not found or unauthorized' });
        }

        await client.query('DELETE FROM notes WHERE id = $1', [id]);

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).json({ error: 'Failed to delete note' });
    }
};

// Get all users (Admin only)
const getUsers = async (req, res) => {
    try {
        const result = await client.query('SELECT id, name, email FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

module.exports = {
    getExample,
    testDatabase,
    createUser,
    loginUser,
    authenticateUser,
    createNote,
    getNotesByUser,
    editNote,
    deleteNote,
    getUsers,
};
