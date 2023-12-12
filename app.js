// app.js
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const connectDB = require('./mongoose'); // Import the connectDB function

const app = express();
const port = 3000;

app.use(express.static('public'));

// Connect to the database
connectDB();

// Use the routes defined in the routes module
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
