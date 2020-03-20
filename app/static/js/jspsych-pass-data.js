function pass_data(workerId, assignmentId, hitId, a, tp_a, b, tp_b, c, tp_c) {

  // Concatenate metadata into complete URL (returned on success).
  var url = "/complete?workerId=" + workerId + "&assignmentId=" + assignmentId + "&hitId=" + hitId + "&a=" + a + "&tp_a=" + tp_a + "&b=" + b + "&tp_b=" + tp_b + "&c=" + c + "&tp_c=" + tp_c;

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
