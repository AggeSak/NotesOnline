const express = require('express');
const router = express.Router();
const exampleController = require('./controllers/exampleController');

// Example route
router.get('/example', exampleController.getExample);

// Test database connection
router.get('/test-db', exampleController.testDatabase);

// User routes
router.post('/users', exampleController.createUser);
router.get('/users', exampleController.getUsers);

// Note routes
router.post('/notes', exampleController.createNote);
router.get('/notes/:user_id', exampleController.getNotesByUser);

module.exports = router;