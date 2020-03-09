function reject_hit(error) {

  // `error` is the error number to redirect to.
  var url = "/error/" + error;

  $.ajax({
    url: "datadump",
    method: 'POST',
    contentType: false,
  }).done(function(data, textStatus, jqXHR) {
    window.location.replace(url);
  }).fail(function(error) {
    console.log(error);
  });

}
