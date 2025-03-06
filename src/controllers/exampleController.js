const client = require('../db');

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

// Create a new user
const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const result = await client.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

// Create a new note
const createNote = async (req, res) => {
    const { user_id, title, content } = req.body;

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

// Get all users
const getUsers = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Get all notes for a user
const getNotesByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await client.query('SELECT * FROM notes WHERE user_id = $1', [user_id]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
};

module.exports = {
    getExample,
    testDatabase,
    createUser,
    createNote,
    getUsers,
    getNotesByUser,
};