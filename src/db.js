const { Client } = require('pg');
require('dotenv').config({ path: '../.env' });

console.log('DATABASE_URL:', process.env.DATABASE_URL);


const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error:', err));

module.exports = client;
