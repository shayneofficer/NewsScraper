$(document).ready(function () {

    function load() {
        $.getJSON("/articles").then(function (data) {
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

            var articleCard = `<div class="card" data-id="${articles[i]._id}" ><div class="card-header"><h3><a class="article-link" target="_blank" href="${articles[i].url}">${articles[i].headline}</a></h3><h4><a class="btn btn-success save">Save Article</a><a class="btn btn-info notes">Article Notes</a></h4></div><div class="card-body"><div class='row'><div>${articles[i].summary}</div></div></div></div>`

            $("#articles").append(articleCard);
        }
    }

    function showNotes(notes, id) {

        $("#notes").empty();

        var input = "<h2 class='text-center'>Leave a Note</h2>";
        input += "<form>";
        input += "<input data-id='" + id + "' type='text' placeholder='note' class='note-input'></input>";
        input += "<button type='submit' class='submit-note'>Submit</button>";
        input += "</form>";


        $("#notes").append(input);

        for (var i = 0; i < notes.length; i++) {
            var noteCard = `<div class="card" data-id="${id}" ><div class="card-header"><h4><a class="btn btn-info delete-note">Delete Note</a></h4></div><div class="card-body">${notes[i].text}</div></div></div>`

            $("#notes").append(noteCard);
        }
    }

    function alertEmpty() {
        var message = "<h4>Uh Oh. Looks like we don't have any new articles.</h4><div class='card-body text-center'><h4><a class='btn scrape-new'>Try Scraping New Articles</a></h4><h4><a href='/saved' class='btn'>Go to Saved Articles</a></h4></div>";

        $("#articles").append(message);
    }

    $(document).on("click", ".btn.save", function () {
        var article = $(this).parents(".card").data();

        $(this).parents(".card").remove();

        $.post("/articles/save/" + article.id).then(function () {
        })
    });

    $(document).on("click", ".submit-note", function (event) {
        event.preventDefault();

        var id = $(".note-input").data().id;
        var text = $(".note-input").val();
        $(".note-input").val("")

        $.post("/articles/" + id, { text: text }).then(function (data) {
            getNotes(id);
        }).catch(function (err) {
        });
    });

    $(".clear").on("click", function () {
        $("#articles").empty();
        alertEmpty();
        $.delete("/articles/clear").then(function (data) {
            console.log(data);
        }).catch(function (err) {
            console.log(err);
        })
    })

    $(document).on("click", ".scrape-new", function () {
        $.get("/scrape").then(function (data) {
            load();
        });
    });

    $(document).on("click", ".btn.notes", function () {
        var article = $(this).parents(".card").data();
        getNotes(article.id);
    });

    function getNotes(id) {
        $.get("/articles/" + id).then(function (data) {
            showNotes(data[0].note, id);
        });
    }

    load();
})



