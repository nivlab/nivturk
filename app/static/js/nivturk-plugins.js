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

// Successful completion of experiment: redirect with completion code.
function redirect_success(workerId, assignmentId, hitId, a, tp_a, b, tp_b, c, tp_c) {

  // Concatenate metadata into complete URL (returned on success).
  var url = "/complete?workerId=" + workerId + "&assignmentId=" + assignmentId + "&hitId=" + hitId + "&a=" + a + "&tp_a=" + tp_a + "&b=" + b + "&tp_b=" + tp_b + "&c=" + c + "&tp_c=" + tp_c;

  $.ajax({
    url: "/redirect_success",
    method: 'POST',
    data: JSON.stringify(jsPsych.data.get().json()),
    contentType: "application/json; charset=utf-8",
  }).done(function(data, textStatus, jqXHR) {
    window.location.replace(url);
  }).fail(function(error) {
    console.log(error);
  });

}

// Unsuccessful completion of experiment: redirect with decoy code.
function redirect_reject(error) {

  // Concatenate metadata into complete URL (returned on reject).
  var url = "/error/" + error;

  $.ajax({
    url: "/redirect_reject",
    method: 'POST',
    data: JSON.stringify(jsPsych.data.get().json()),
    contentType: "application/json; charset=utf-8",
  }).done(function(data, textStatus, jqXHR) {
    window.location.replace(url);
  }).fail(function(error) {
    console.log(error);
  });
}

// Unsuccessful completion of experiment: redirect to error page.
function redirect_error(error) {

  // error is the error number to redirect to.
  var url = "/error/" + error;

  $.ajax({
    url: "/redirect_error",
    method: 'POST',
    data: JSON.stringify(jsPsych.data.get().json()),
    contentType: "application/json; charset=utf-8",
  }).done(function(data, textStatus, jqXHR) {
    window.location.replace(url);
  }).fail(function(error) {
    console.log(error);
  });

}
