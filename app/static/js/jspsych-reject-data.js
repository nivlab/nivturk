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
