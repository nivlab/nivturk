// Pass message from jsPsych to NivTurk
function pass_message(msg) {

  $.ajax({
    url: "/experiment",
    method: 'POST',
    data: JSON.stringify(msg),
    contentType: "application/json; charset=utf-8",
  }).done(function(data, textStatus, jqXHR) {
    // do nothing on success
  }).fail(function(error) {
    console.log(error);
  });

}

// Write data on experiment end
function save_data(status) {

  $.ajax({
    url: "/save_data?status=" + status,
    method: 'POST',
    data: JSON.stringify(jsPsych.data.get().json()),
    contentType: "application/json; charset=utf-8",
  }).done(function(data, textStatus, jqXHR) {
    // if complete, redirect to complete page. otherwise, do nothing
    if (status == "complete") {
      window.location.replace("/complete");
    }
  }).fail(function(error) {
    console.log(error);
  });

}
