const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const { PORT, DATABASE_URL } = require('./config');

const seedData = require('./db/todos.json');

const app = express(); 
app.use(express.static('public'));
app.use(express.json());

const todosRouter= require('./todosRouter');
  app.use('/v1/todos', todosRouter);




module.exports = app; // Export for testing
