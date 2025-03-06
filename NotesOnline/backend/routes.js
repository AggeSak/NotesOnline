const express = require('express');
const client = require('./db');
const router = express.Router();

// Create a new user
router.post('/users', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Create a new note
router.post('/notes', async (req, res) => {
    const { user_id, title, content } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [user_id, title, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create note' });
    }
});

// Get all notes for a user
router.get('/notes/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await client.query('SELECT * FROM notes WHERE user_id = $1', [user_id]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

module.exports = router;