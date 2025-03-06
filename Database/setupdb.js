const { Client } = require('pg');

// Connection string with SSL enabled
const connectionString = 'postgresql://notes_3hr9_user:PAF2ail5FOQZ2nZ5aiCGinGE0Kj08X7S@dpg-cv4ssvt6l47c73ar8e4g-a.oregon-postgres.render.com/notes_3hr9';

// Create a new client with SSL configuration
const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false, // Required for Render's SSL certificate
    },
});

// SQL code to create tables
const sqlCode = `
    -- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,      -- Auto-incrementing ID
  name VARCHAR(100) NOT NULL,  -- User's name
  email VARCHAR(100) UNIQUE NOT NULL,  -- User's email (unique)
  password VARCHAR(255) NOT NULL,      -- User's password (hashed)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when user was created
);

-- Create Notes Table
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,      -- Auto-incrementing ID
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Foreign Key to Users
  title VARCHAR(255) NOT NULL, -- Note's title
  content TEXT NOT NULL,       -- Note's content
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when note was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when note was last updated
);
`;

// Connect to the database and execute the SQL code
client.connect()
    .then(() => {
        console.log('Connected to the database');
        return client.query(sqlCode); // Execute the SQL code
    })
    .then(() => {
        console.log('Tables created successfully');
    })
    .catch((err) => {
        console.error('Error:', err);
    })
    .finally(() => {
        client.end(); // Close the connection
    });