// Dependencies
var express = require('express');
var path = require('path');

// Express setup
var app = express();
var PORT = 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

server.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });