var express = require("express");
var handlebars = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require('./models');

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static('public'));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"

// Connect to the MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// Default home GET route
app.get("/", function (req, res) {

    db.Article.find({}).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });

    // res.sendFile("index.html");
})

app.get("/scrape", function (req, res) {

    axios.get("https://www.chicagobusiness.com/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("div.middle-article-block").each(function (i, element) {
            var result = {};

            result.title = $(element).find("div.middle-article-headline").text();

            console.log(result);
        });
    });
    res.send("Scrape Complete");
});

// Start the server
app.listen(PORT, function () {
    console.log("App listening on port http://localhost:" + PORT + " !");
})