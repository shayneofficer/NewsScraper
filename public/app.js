$(document).ready(function () {

    function initPage() {
        $.getJSON("/articles?saved=false").then(function (data) {
            $("#articles").empty();
            if (data && data.length) {
                renderArticles(data);
            } else {
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        for (var i = 0; i < articles.length; i++) {

            var articleCard = `<div class="card" data-id="${articles[i]._id}" ><div class="card-header"><h3><a class="article-link" target="_blank" rel="noopener noreferrer" href="${articles[i].url}">${articles[i].headline}</a><a class="btn btn-success save">Save Article</a></h3></div><div class="card-body"><div class='row'><div class='col-md-2'><img src='${articles[i].photo}' alt='article-photo' width='200'></div><div class='col-md-10'>${articles[i].summary}</div></div></div></div>`

            // Display the apropos information on the page
            $("#articles").append(articleCard);
        }
    }

    function renderEmpty() {
        var emptyAlert = $(
            [
                "<div class='alert alert-warning text-center'>",
                "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
                "</div>",
                "<div class='card'>",
                "<div class='card-header text-center'>",
                "<h3>What Would You Like To Do?</h3>",
                "</div>",
                "<div class='card-body text-center'>",
                "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
                "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
                "</div>",
                "</div>"
            ].join("")
        );
        // Appending this data to the page
        $("#articles").append(emptyAlert);
    }

    $(document).on("click", ".btn.save", function () {
        var articleToSave = $(this).parents(".card").data();
        console.log(articleToSave);

        // Remove card from page
        $(this).parents(".card").remove();

        articleToSave.saved = true;
        // Using a patch method to be semantic since this is an update to an existing record in our collection
        $.put("/articles/save/" + articleToSave._id).then(function () {
            initPage();
        })
    });

    $(".clear").on("click", function () {
        $("#articles").empty();
        renderEmpty();
    })

    $(document).on("click", ".scrape-new", function () {
        $.get("/scrape").then(function (data) {
            initPage();
        });
    });

    initPage();
})

