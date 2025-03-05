// db.js
const { Client } = require('pg');
require('dotenv').config();

// Create a PostgreSQL client and connect using the environment variable DATABASE_URL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },  // This is necessary for secure connections on Render
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((err) => console.error('Connection error', err.stack));

module.exports = client;
