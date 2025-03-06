const { Client } = require('pg');

const connectionString = 'postgresql://notes_3hr9_user:PAF2ail5FOQZ2nZ5aiCGinGE0Kj08X7S@dpg-cv4ssvt6l47c73ar8e4g-a.oregon-postgres.render.com/notes_3hr9';

const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error:', err));

module.exports = client;