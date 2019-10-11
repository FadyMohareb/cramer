#!/usr/bin/env node
const dotenv = require('dotenv');
// Set the env variables
dotenv.config();

const User = require('../models/User.js');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL);
var db = mongoose.connection;
db.on('error', function (err) {
  if (err) {
    console.log('Connection to the database failed', err);
  } else {
    console.log('Connection to the database success');
  }
});
db.once('open', function () {
  console.log('MongoDB connection open');
});

if (process.argv.length < 5) {
  console.log('Usage: npm run newUser <user@example.com> <password> <John>');
  process.exit();
}

var email = process.argv[2];
var password = process.argv[3];
var name = process.argv[4];

const newUser = new User({
  name: name,
  email: email,
  password: password
});

User.createUser(newUser, function (err, u) {
  if (err) {
    console.log(err); 
    process.exit(1);
  }
  console.log('success');
  process.exit();
});