const { Client } = require('pg');

// Connection string with SSL enabled
const connectionString = 'postgresql://db_294o_user:CjFPkh5QD6E88foyTq1tbusLWmynpnc1@dpg-d0memo3e5dus738f8r8g-a/db_294o';

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