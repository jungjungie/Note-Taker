// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');

// Express setup
var app = express();
var PORT = process.env.PORT || 8080;

let notesArr = [];

// Reassigns notesArr to JSON object saved in db.json
fs.readFile('db/db.json', 'utf8', function (err, data) {
    if (err) throw err;
    notesArr = JSON.parse(data);
})

// Express setup to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// =============================================================
app.use(express.static('public'));

// Displays notes page
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
    let id = 1;

    notesArr.push(newNote);

    notesArr.forEach(item => {
        item.id = id;
        id++
    })
    console.log(notesArr);

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

        notesArr = JSON.parse(data);
        let chosenId = req.params.id;
    
        for (let i=0; i < notesArr.length; i++) {
            if (chosenId == notesArr[i].id) {
                let chosenIndex = notesArr.indexOf(notesArr[i]);

                notesArr.splice(chosenIndex, 1);

                fs.writeFile("db/db.json", JSON.stringify(notesArr), function(err) {
                    if (err) throw err;
                    console.log('Your notesArr was successfully re-written to db.json!')
                })

                return res.json(notesArr);
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