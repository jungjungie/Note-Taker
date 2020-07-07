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

// Routes
// =============================================================
app.use(express.static('public'));

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});
  
// Reads db.json and returns all saved notes as JSON
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "db/db.json"));
});

// Receives a new note to save, adds it to db.json, and returns the new note to the client
app.post("/api/notes", function(req, res) {
    let newNote = req.body;
    notesArr.push(newNote);
    console.log(notesArr);

    let id = 1;

    notesArr.forEach(item => {
        item.id = id;
        id++
    })

    fs.writeFile("db/db.json", JSON.stringify(notesArr), function(err) {
        if (err) throw err;
        console.log('Your notesArr was successfully written to db.json!')
    })

    return res.json(newNote);
});

// Deletes the selected note from db.json and then rewrites the remaining notes in the array to db.json 
app.delete("/api/notes/:id", function(req, res) {
    fs.readFile('db/db.json', 'utf8', function (err, data) {
        if (err) throw err;

        let savedNotesArr = JSON.parse(data);
        let chosenId = req.params.id;
    
        for (let i=0; i < savedNotesArr.length; i++) {
            if (chosenId == savedNotesArr[i].id) {
                let chosenIndex = savedNotesArr.indexOf(savedNotesArr[i]);

                savedNotesArr.splice(chosenIndex, 1);

                fs.writeFile("db/db.json", JSON.stringify(savedNotesArr), function(err) {
                    if (err) throw err;
                    console.log('Your savedNotesArr was successfully written to db.json!')
                })

                notesArr = savedNotesArr;
                return res.json(savedNotesArr);
            }
        }
    })
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// =============================================================
// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});