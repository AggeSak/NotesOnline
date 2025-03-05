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
