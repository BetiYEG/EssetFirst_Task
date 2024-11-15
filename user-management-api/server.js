const express = require('express');
const { v4: uuidv4 } = require('uuid'); // For unique user IDs
const cors = require('cors'); // Middleware to handle CORS

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors()); 

// In-memory data storage
let users = [];

// POST /users - Add a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  // Validate input
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const newUser = { id: uuidv4(), name, email };
  users.push(newUser);

  return res.status(201).json(newUser); 
});

// GET /users - Retrieve all users
app.get('/users', (req, res) => {
  return res.json(users); // Return all users
});

// PUT /users/:id - Update a user by ID
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  // Find the user by ID
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // Update the user's data
  users[userIndex] = { ...users[userIndex], name, email };

  return res.json(users[userIndex]); // Return updated user
});

// DELETE /users/:id - Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  // Find the user by ID
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // Remove user from the array
  users.splice(userIndex, 1);

  return res.json({ message: 'User deleted successfully.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
