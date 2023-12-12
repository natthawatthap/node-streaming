const express = require('express');
const routes = require('./routes/routes');
const connectDB = require('./database/mongoose'); 

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
