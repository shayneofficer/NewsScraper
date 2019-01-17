$(document).ready(function () {

    function load() {
        $.getJSON("/articles/saved").then(function (data) {
            console.log(data);
            $("#articles").empty();
            if (data && data.length) {
                showArticles(data);
            } else {
                alertEmpty();
            }
        });
    }

    function showArticles(articles) {
        for (var i = 0; i < articles.length; i++) {

            var articleCard = `<div class="card" data-id="${articles[i]._id}" ><div class="card-header"><h3><a class="article-link" target="_blank" rel="noopener noreferrer" href="${articles[i].url}">${articles[i].headline}</a></h3><h4><a class="btn btn-danger delete">Delete From Saved</a><a class="btn btn-info notes">Article Notes</a></h4></div><div class="card-body"><div class='row'><div>${articles[i].summary}</div></div></div></div>`

            $("#articles").append(articleCard);
        }
    }

    function alertEmpty() {
        var message = "<h4>Uh Oh. Looks like we don't have any saved articles.</h4><div class='card-body text-center'><h4><a href='/'>Browse Articles</a></h4></div>";

        $("#articles").append(message);
    }

    $(document).on("click", ".btn.delete", function () {
        var article = $(this).parents(".card").data();
        $(this).parents(".card").remove();

        $.post("/articles/unsave/" + article.id).then(function () {
            load();
        })
    });

    $(".clear").on("click", function () {
        $("#articles").empty();
        alertEmpty();
    });

    load();
});