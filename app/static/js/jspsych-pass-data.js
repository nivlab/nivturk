function pass_data(workerId, assignmentId, hitId) {

  // Concatenate metadata into complete URL (returned on success).
  var url = "/complete?workerId=" + workerId + "&assignmentId=" + assignmentId + "&hitId=" + hitId;

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
