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

// Save an incomplete dataset.
function incomplete_save() {

    $.ajax({
        url: "/incomplete_save",
        method: 'POST',
        data: JSON.stringify(jsPsych.data.get().json()),
        contentType: "application/json; charset=utf-8",
    }).done(function(data, textStatus, jqXHR) {
        // do nothing
    }).fail(function(error) {
        // do nothing
    });

}


// Successful completion of experiment: redirect with completion code.
// Successful completion of all experiments.
function redirect_success() {
    var url = "/complete";
    $.ajax({
    url: "/redirect_success",
    method: 'POST',
    data: JSON.stringify(jsPsych.data.get().json()),
    contentType: "application/json; charset=utf-8",
  }).done(function(data, textStatus, jqXHR) {
    window.location.replace(url);
  }).fail(function(error) {w
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



// Return datetime
function get_datetime() {
  const date = new Date();
  return String(date.getFullYear()) + String(date.getMonth() + 1) + String(date.getDate()) + String(date.getHours()) + String(date.getMinutes()) + String(date.getSeconds());
}


var GETSUBJECTID = {
  type: jsPsychSurveyText,
  button_label: 'Continue',
  questions: [
    {prompt: 'Please enter subject ID here', required: true}
  ],
  on_finish: function(data){
    // Extract metadata
    workerId  = JSON.parse(data.response["Q0"]);
    task = data.task;
    timestamp = get_datetime();

    // Append metadata
    jsPsych.data.addProperties({
      workerId: workerId,
    });
  }

}
function login(){
  var url = '/experiment'; 
  
  $.ajax({
    url: "/postlogin?timestamp="+get_datetime(),
    method: 'POST',
    data: JSON.stringify(jsPsych.data.get().json()),
    contentType: "application/json; charset=utf-8",
  }).done(function(data, textStatus, jqXHR) {
    window.location.replace(url);
  }).fail(function() {
    console.log("login error");
  });
}

