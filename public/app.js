// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /><br />" + data[i].summary + "<br /><br />" + "<a href='" + data[i].link + "'>Click Here for Article!</a>" + "<br /><hr />" +  "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  loadNotes($(this).attr("data-id"));
});

$(document).on("click", ".noteDelete", function() {
  $.ajax({
    method: "DELETE",
    url: "/notes/" + $(this).attr("data-id"),
  }).then(response => {
    console.log(response);
    loadNotes($("#savenote").attr("data-id"));
  })
})

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      loadNotes($("#savenote").attr("data-id"));
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

function loadNotes(articleID) {
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = articleID;

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        data.note.forEach(item => {
          $("#notes").append(`<h4>${item.title}</h4>`);
          $("#notes").append(`<p>${item.body}</p>`);
          $("#notes").append(`<button class="noteDelete" data-id="${item._id}">Delete</button>`)
          $("#notes").append("<hr>");
        })
      }
    });
}