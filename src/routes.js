const express = require('express');
const router = express.Router();
const exampleController = require('./controllers/exampleController');

// User routes
router.post('/users', exampleController.createUser); // Sign up
router.get('/users', exampleController.getUsers); // Get all users

// Note routes
router.post('/notes', exampleController.createNote); // Create a new note
router.get('/notes', exampleController.getNotesByUser); // Get notes for logged-in user
router.post('/login', exampleController.loginUser);  // Add this route
router.delete('/notes/:id', exampleController.deleteNote); // Add this route
router.put('/notes/:id', exampleController.ModifyNote); // Add this route



module.exports = router;
