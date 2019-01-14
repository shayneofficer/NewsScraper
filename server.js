var express = require("express");
var handlebars = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");


var axios = require("axios");
var cheerio = require("cheerio");

var PORT = 3000;

var app = express();

app.use(logger('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

var databaseUrl = "mongodb://localhost/test_db"

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect(databaseUrl, { useNewUrlParser: true });
}

var db = mongoose.connection;
db.on('error', function (err) {
    console.log('Mongoose Error: ', err);
});
db.once('open', function () {
    console.log('Mongoose connection successful.');
})

app.get("/", function (req, res) {
    db.Test.create({
        "working": "yes"
    });
    res.sendFile("index.html");
})

app.listen(PORT, function () {
    console.log("App listening on port " + PORT + "!");
})