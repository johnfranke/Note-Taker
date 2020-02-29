//All initial server set up items.
var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = process.env.PORT || 3000;

var ID = 0;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});

//Routes to various pages/files.
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
  });

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "db.json"));
});

app.get("/assets/js/index.js", function(req, res) {
    res.sendFile(path.join(__dirname, "assets/js/index.js"));
});

app.get("/assets/css/styles.css", function(req, res) {
    res.sendFile(path.join(__dirname, "assets/css/style.css"));
});

//server side getting new notes and saving them to db.json
app.post("/api/notes", function(req, res) {
    ID ++;
    var newNote = {"id": ID, "title":req.body.title,"text":req.body.text};
    fs.readFile('db.json', function (err, data) {
        var json = JSON.parse(data);
        json.push(newNote);
        fs.writeFile("db.json", JSON.stringify(json), function(err) {
            if (err) throw err;
            console.log('Added note to db.json');
        });
    });
    res.send(newNote);
})

//server side deleting notes from db.json
app.delete("/api/notes/:id", function(req, res) {
    var idToDelete = req.params.id;

    fs.readFile('db.json', function (err, data) {
        var json = JSON.parse(data);
        
        for (i=0;i<json.length;i++) {
            if (idToDelete == json[i].id) {
                console.log("Id found");
                json.splice( i, 1 );
            }
        }
        
        fs.writeFile("db.json", JSON.stringify(json), function(err) {
            if (err) throw err;
            console.log('Added note to db.json');
        });
    });
    res.sendStatus(200);
})