// server.js
const express = require('express');
const bcrypt = require('bcrypt');
const client = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());  // Parse JSON request bodies

// User Registration Route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Please provide name, email, and password.');
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the users table
    const result = await client.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    const user = result.rows[0];  // Get the inserted user
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Error registering user.');
  }
});

// Add Note Route
app.post('/notes', async (req, res) => {
  const { userId, title, content } = req.body;

  if (!userId || !title || !content) {
    return res.status(400).send('Please provide userId, title, and content for the note.');
  }

  try {
    // Insert note into the notes table
    const result = await client.query(
      'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING id, title, content',
      [userId, title, content]
    );

    const note = result.rows[0];  // Get the inserted note
    res.status(201).json({ id: note.id, title: note.title, content: note.content });
  } catch (err) {
    console.error('Error adding note:', err);
    res.status(500).send('Error adding note.');
  }
});

// Get Notes by User ID
app.get('/notes/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Retrieve notes for the given userId
    const result = await client.query(
      'SELECT * FROM notes WHERE user_id = $1',
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).send('Error fetching notes.');
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
