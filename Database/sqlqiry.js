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

// SQL query to fetch all rows from the users table
const sqlCode = `SELECT * FROM users WHERE name = 'aggelos'`;

// Connect to the database and execute the SQL query
client.connect()
    .then(() => {
        console.log('Connected to the database');
        return client.query(sqlCode); // Execute the SQL query
    })
    .then((result) => {
        console.log('Users Table shown successfully');
        console.log('Rows:', result.rows); // Log the rows returned by the query
    })
    .catch((err) => {
        console.error('Error:', err);
    })
    .finally(() => {
        client.end(); // Close the connection
    });