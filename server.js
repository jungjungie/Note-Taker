// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');

// Express setup
var app = express();
var PORT = 8080;

let notesArr = [];

// Express setup to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
// =============================================================
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Receives a new note to save, adds it to db.json, and returns the new note to the client
app.post("/api/notes", function(req, res) {
    var newNote = req.body;
    console.log(newNote);

    notesArr.push(newNote);
    console.log(notesArr);

    fs.writeFile("db/db.json", JSON.stringify(notesArr), function(err) {
        if (err) throw err;
        console.log('db.json was successfully written!')
    })

    // return res.json(newNote);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// =============================================================
// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});