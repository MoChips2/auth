const express = require('express');
const app = express();
const mongoose = require('mongoose');

//Import Routes
const authRoute = require('./routes/auth');

//Connect to DB
mongoose.connect(
  'mongodb://localhost/auth',
  { useNewUrlParser: true },
  () => console.log('connected to db!')
);

//Middleware
app.use(express.json());

//Route Middlewares
app.use('/api/user', authRoute)

//Listener
app.listen(3000, () => console.log('Server listening on host:3000'));