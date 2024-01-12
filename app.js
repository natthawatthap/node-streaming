const express = require('express');
const routes = require('./routes/routes');
const connectDB = require('./database/mongoose'); 
const compression = require('compression');

const app = express();
const port = process.env.PORT || 3000;

// Enable Gzip compression middleware
app.use(compression());
app.use(express.static('public'));

// Connect to the database
connectDB();

// Use the routes defined in the routes module
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;