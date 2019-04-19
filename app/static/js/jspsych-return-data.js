function return_data() {
  $.ajax({
    url: "datadump",
    method: 'POST',
    data: JSON.stringify(jsPsych.data.get().json()),
    contentType: "application/json; charset=utf-8",
  }).done(function(data, textStatus, jqXHR) {
    window.location.replace("/complete");
    // window.location.replace("https://www.turkprime.com/Router/End?aid=dummy")
  }).fail(function(error) {
    // TODO what to do if the server fails? Might be good to handle that here.
    console.log(error);
  });
}
