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

// Successful completion of experiment. Approve participant's work.
function pass_data(workerId, assignmentId, hitId) {

  // Concatenate metadata into complete URL (returned on success).
  var url = "/complete";

  $.ajax({
    url: "/data_pass",
    method: 'POST',
    data: JSON.stringify(jsPsych.data.get().json()),
    contentType: "application/json; charset=utf-8",
  }).done(function(data, textStatus, jqXHR) {
    window.location.replace(url);
  }).fail(function(error) {
    console.log(error);
  });
}

// Unsuccessful completion of experiment. Reject participant's work.
function reject_data(error) {

  // error is the error number to redirect to.
  var url = "/error/" + error;

  $.ajax({
    url: "/data_reject",
    method: 'POST',
    data: JSON.stringify(jsPsych.data.get().json()),
    contentType: "application/json; charset=utf-8",
  }).done(function(data, textStatus, jqXHR) {
    window.location.replace(url);
  }).fail(function(error) {
    console.log(error);
  });
}
