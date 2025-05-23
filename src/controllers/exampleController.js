const client = require('../db');
<<<<<<< HEAD
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
=======
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
>>>>>>> 3f87e4d9688547501cdacf2fa3e449e80c2edcb4

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


const deleteNote = async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Authorization required" });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        console.log(`Attempting to delete note with ID: ${id} for user ID: ${userId}`);

        // Check if the note exists and belongs to the user
        const note = await client.query(
            "SELECT * FROM notes WHERE id = $1 AND user_id = $2",
            [id, userId]
        );

        if (note.rows.length === 0) {
            console.log("Note not found or unauthorized");
            return res.status(404).json({ error: "Note not found or unauthorized" });
        }

        // Delete the note
        await client.query("DELETE FROM notes WHERE id = $1", [id]);

        console.log("Note deleted successfully");
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (err) {
        console.error("Error deleting note:", err);
        res.status(500).json({ error: "Failed to delete note" });
    }
};

<<<<<<< HEAD


=======
>>>>>>> 3f87e4d9688547501cdacf2fa3e449e80c2edcb4
// Create a new user (Sign Up)
const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
<<<<<<< HEAD
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password before saving to the DB
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUserResult = await client.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );

        // Generate a JWT token
        const token = jwt.sign({ userId: newUserResult.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: newUserResult.rows[0] });
=======
        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await client.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({ user, token });
>>>>>>> 3f87e4d9688547501cdacf2fa3e449e80c2edcb4
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

<<<<<<< HEAD
// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
=======
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

>>>>>>> 3f87e4d9688547501cdacf2fa3e449e80c2edcb4
    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, result.rows[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: result.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token, user: result.rows[0] });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Failed to log in user' });
    }
};

<<<<<<< HEAD

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
=======
// Get all notes for logged-in user
const getNotesByUser = async (req, res) => {
    const user_id = req.userId; // From authenticateUser middleware
>>>>>>> 3f87e4d9688547501cdacf2fa3e449e80c2edcb4

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

<<<<<<< HEAD
// Create a new note (only accessible if user is authenticated)
const ModifyNote = async (req, res) => {
    const { id } = req.params; // Get note ID from URL
    const { title, content } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authorization required' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        console.log(`Updating note ID: ${id} for user ID: ${userId}`);

        // Check if the note exists and belongs to the user
        const note = await client.query(
            'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (note.rows.length === 0) {
            console.log('Note not found or unauthorized');
            return res.status(404).json({ error: 'Note not found or unauthorized' });
        }

        // Update the note
=======
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

>>>>>>> 3f87e4d9688547501cdacf2fa3e449e80c2edcb4
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

<<<<<<< HEAD
=======
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
>>>>>>> 3f87e4d9688547501cdacf2fa3e449e80c2edcb4

module.exports = {
    createUser,
    loginUser,
<<<<<<< HEAD
    getUsers,
    createNote,
    getNotesByUser,
    deleteNote,
    ModifyNote 
=======
    authenticateUser,
    createNote,
    getNotesByUser,
    editNote,
    deleteNote,
    getUsers,
>>>>>>> 3f87e4d9688547501cdacf2fa3e449e80c2edcb4
};
